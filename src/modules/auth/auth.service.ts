import * as bcrypt from 'bcrypt';

import { ROLE } from '../../shared/roles/constants/role.constants';
import { MeDto } from './dto/me.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@/generated/prisma/enums';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService,
    ) { }

    async register(body: RegisterDto) {
        const { name, email, password } = body;

        const exists = await this.prisma.user.findUnique({
            where: { email: email },
            select: { id: true }
        });

        if (exists) throw new ConflictException('Account with that email already exists');

        const hashed = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: name ?? email,
                email: email,
                password: hashed,
                roles: {
                    create: {
                        role: { connect: { code: ROLE.USER } },
                    },
                },
            },
            select: {
                id: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                code: true,
                                rolePermissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }
        });

        return this.generateTokens({
            sub: String(user.id),
            roles: user.roles.map(r => r.role.code),
            permissions: user.roles.flatMap(r =>
                r.role.rolePermissions.map(rp => rp.permission.key),
            )
        });
    }

    async login(body: LoginDto) {
        const { email, password } = body;

        const user = await this.prisma.user.findUnique({
            where: { email: email, status: UserStatus.active },
            select: {
                id: true,
                password: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                code: true,
                                rolePermissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }
        });

        if (!user) throw new UnauthorizedException();

        const valid = await bcrypt.compare(password, user.password ?? "");
        if (!valid) throw new UnauthorizedException();

        return this.generateTokens({
            sub: String(user.id),
            roles: user.roles.map(r => r.role.code),
            permissions: user.roles.flatMap(r =>
                r.role.rolePermissions.map(rp => rp.permission.key),
            )
        });
    }

    async getProfile(body: MeDto) {
        const { sub } = body;

        const user = await this.prisma.user.findUnique({
            where: {
                id: sub,
                // status: UserStatus.active,
            },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                avatar: true,
                created_at: true,
                updated_at: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                code: true,
                                rolePermissions: {
                                    select: {
                                        permission: {
                                            select: {
                                                key: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) throw new UnauthorizedException();

        if (user.status === UserStatus.banned) throw new UnauthorizedException("Account has been banned");

        // ✅ flatten permissions theo role
        const permissions = user.roles.flatMap(r =>
            r.role.rolePermissions.map(rp => rp.permission.key),
        );

        return {
            ...user,
            permissions,
        };
    }

    async updateProfile(payload: MeDto) {
        const { sub, roles, body } = payload;
        if (!body) throw new BadRequestException("Invalid input data");

        const user = await this.prisma.user.findUnique({
            where: {
                id: sub,
                status: UserStatus.active,
            },
            select: { id: true }
        });

        if (!user) throw new UnauthorizedException();

        const updated = await this.prisma.user.update({
            data: body,
            where: { id: sub },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                avatar: true,
                created_at: true,
                updated_at: true,
                // roles: { include: { role: true } }
            }
        });

        return updated;
    }

    generateTokens(payload: any) {
        return {
            access_token: this.jwt.sign(payload, { expiresIn: '1h' }),
            refresh_token: this.jwt.sign(payload, { expiresIn: '1d' }),
        };
    }
}