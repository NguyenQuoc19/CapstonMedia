import { LoginDto } from "./dto/login.dto";
import { ProfileDto } from "./dto/profile.dto";
import { PERMISSION } from "@/shared/roles/constants/permission.constants";
import { RegisterDto } from "./dto/register.dto";
import { Permissions } from "./decorators/permissions.decorator";
import { AuthService } from "./auth.service";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { successResponse } from "@/shared/response";
import { PermissionGuard } from "./guards/permission.guard";
import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";

import type { JwtPayload } from "@/common/types/jwt-payload.type";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("register")
    async register(
        @Body()
        body: RegisterDto,
    ) {
        const result = await this.authService.register(body);
        return successResponse(result, 'Register successfully');
    }

    @Post("login")
    async login(
        @Body()
        body: LoginDto,
    ) {
        const result = await this.authService.login(body);
        return successResponse(result, 'Login successfully');
    }

    @Get('me')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions(PERMISSION.PROFILE_READ)
    async getProfile(@CurrentUser() user: JwtPayload) {
        const result = await this.authService.getProfile({ sub: +user.sub, roles: user.roles })
        return successResponse(result, 'Retrieved successfully');;
    }

    @Put('me')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions(PERMISSION.PROFILE_CREATE)
    async updateProfile(
        @CurrentUser()
        user: JwtPayload,
        @Body()
        body: ProfileDto
    ) {
        const result = await this.authService.updateProfile({ sub: +user.sub, roles: user.roles, body })
        return successResponse(result, 'Retrieved successfully');
    }
}