import * as bcrypt from 'bcrypt';

import { ROLE } from '../../shared/roles/constants/role.constants';
import { MeDto } from './dto/me.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@/generated/prisma/enums';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UploadService } from '@/shared/upload/upload.service';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

const USER_SELECT = {
    id: true,
    roles: {
        select: {
            role: {
                select: {
                    code: true,
                    rolePermissions: { select: { permission: { select: { key: true }, }, }, },
                },
            },
        },
    },
}

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private prisma: PrismaService,
        private readonly uploadService: UploadService
    ) { }

    async register(body: RegisterDto) {
        const { name, email, password } = body;

        const exists = await this.prisma.user.findUnique({
            where: { email: email },
            select: { id: true, deleted_at: true }
        });

        console.log(exists);
        if (exists) {
            if (exists.deleted_at === null) throw new ConflictException('Account with that email already exists');

            const hashed = await bcrypt.hash(password, 10);

            const user = await this.prisma.user.update({
                where: { email },
                data: {
                    password: hashed,
                    deleted_at: null,
                },
                select: USER_SELECT
            });

            return this.generateTokens({
                sub: String(user.id),
                roles: user.roles.map(r => r.role.code),
                permissions: user.roles.flatMap(r =>
                    r.role.rolePermissions.map(rp => rp.permission.key),
                )
            });
        }

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
            select: USER_SELECT
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
            where: { email: email, status: UserStatus.active, deleted_at: null },
            select: { password: true, ...USER_SELECT }
        });

        if (!user) throw new UnauthorizedException('Account not found or already deactivated');

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

    generateTokens(payload: any) {
        return {
            access_token: this.jwt.sign(payload, { expiresIn: '1h' }),
            refresh_token: this.jwt.sign(payload, { expiresIn: '1d' }),
        };
    }

    async getProfile(body: MeDto) {
        const { sub } = body;

        const user = await this.prisma.user.findUnique({
            where: {
                id: sub,
                // status: UserStatus.active,
            },
            select: {
                name: true,
                email: true,
                status: true,
                avatar: true,
                created_at: true,
                updated_at: true,
                ...USER_SELECT
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
        if (body.avatar) throw new BadRequestException("Avatar not support here");

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
            }
        });

        return updated;
    }

    async updateAvatar(payload: MeDto) {
        const { sub, roles, body } = payload;
        if (body?.name || body?.email || body?.status) throw new BadRequestException("Name, Email, Status not support here");
        if (!body?.avatar) throw new BadRequestException("Invalid input data");

        const uploadAvatar = await this.uploadService.uploadFromUrl(body.avatar);

        const { url } = uploadAvatar;

        const user = await this.prisma.user.findUnique({
            where: { id: sub, status: UserStatus.active },
            select: { id: true }
        });

        if (!user) throw new UnauthorizedException();

        const updated = await this.prisma.user.update({
            data: { avatar: url },
            where: { id: sub },
            select: { avatar: true }
        });

        return updated;
    }

    async softDelete(user_id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id, deleted_at: null },
            select: { id: true }
        });

        if (!user) throw new UnauthorizedException('Account not found or already deactivated');

        const softDelete = await this.prisma.user.update({
            where: { id: user_id, deleted_at: null },
            data: { deleted_at: new Date() },
            select: { id: true, name: true, email: true }
        });

        if (!softDelete) throw new BadRequestException('Failed to deactivate the account. Please try again later.');

        return softDelete;
    }
}
