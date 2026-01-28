import { IMAGE_RULE } from "./constants/image.rule";
import { PERMISSION } from "../roles/constants/permission.constants";
import { Permissions } from "@/modules/auth/decorators/permissions.decorator";
import { JwtAuthGuard } from "@/modules/auth/guards/jwt-auth.guard";
import { UploadService } from "./upload.service";
import { PermissionGuard } from "@/modules/auth/guards/permission.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { successResponse } from "../response";
import { Body, Controller, Get, HttpCode, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { IsUrl } from "class-validator";
import { UploadImageUrlDto } from "./dto/upload.dto";

// upload.controller.ts
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions(PERMISSION.PROFILE_CREATE)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: IMAGE_RULE.maxSize },
        }),
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const result = await this.uploadService.uploadImage(file);
        return successResponse(result, "Upload successfully");
    }

    @Post('image-link')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions(PERMISSION.PROFILE_CREATE)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: IMAGE_RULE.maxSize },
        }),
    )
    async uploadImageUrl(
        @Body()
        body: UploadImageUrlDto
    ) {
        const result = await this.uploadService.uploadFromUrl(body.url);
        return successResponse(result, "Upload from link successfully");
    }

    @Get('exists')
    @UseGuards(JwtAuthGuard, PermissionGuard)
    @Permissions(PERMISSION.PROFILE_READ)
    async checkFileExists(@Query('key') key: string) {
        const exists = await this.uploadService.checkExists(key);
        return successResponse(exists, "Retrived file information successfully");
    }
}
