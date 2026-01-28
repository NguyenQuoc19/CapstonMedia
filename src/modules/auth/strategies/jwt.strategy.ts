import { JwtPayload } from '@/common/types/jwt-payload.type';
import { JWT_SECRET } from '@/common/constants/app.constant';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            secretOrKey: JWT_SECRET!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload) {
        /**
         * payload chính là object decode từ JWT
         * return gì thì gắn vào req.user
         */

        if (!payload?.sub) throw new UnauthorizedException('Invalid token');

        return {
            sub: payload.sub,
            roles: payload.roles ?? [],
            permissions: payload.permissions ?? [],
        };
    }
}
