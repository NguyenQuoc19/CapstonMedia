import { Module } from "@nestjs/common";
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from "@/common/constants/app.constant";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UploadModule } from "@/shared/upload/upload.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";

@Module({
    exports: [JwtModule],
    imports: [
        UploadModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule { }