import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaQueryDto } from './dto/media-query.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { successResponse } from '@/shared/response';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query, ParseIntPipe, Put } from '@nestjs/common';

import type { JwtPayload } from "@/common/types/jwt-payload.type";

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  // Account Actions
  @Post('me/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload,
    @Body() body: UploadMediaDto,
  ) {
    const media = await this.mediaService.upload({ file, body, user_id: user.sub });
    return successResponse(media, 'Uploaded successfully');
  }

  @Get('me')
  async findAllOfUser(
    @Query() query: MediaQueryDto,
    @CurrentUser() user: JwtPayload
  ) {
    const { data, meta } = await this.mediaService.findAllOfUser({ query: query, user_id: +user.sub });
    return successResponse(data, 'Account media list retrieved successfully', meta);
  }

  @Put('me/:id')
  @UseInterceptors(FileInterceptor('file'))
  async editMedia(
    @Body() body: UploadMediaDto,
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const media = await this.mediaService.update({
      id,
      body,
      user_id: +user.sub,
    });

    return successResponse(media, 'Media updated successfully.');
  }

  // Saved Media
  @Get('me/saved')
  async getListSave(
    @Query() query: MediaQueryDto,
    @CurrentUser() user: JwtPayload
  ) {
    const { data, meta } = await this.mediaService.getListSaved({ query, user_id: +user.sub });
    return successResponse(data, 'List media saved retrieved successfully', meta);
  }

  @Get('me/saved/:id')
  async getIsSaved(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload
  ) {
    const isSaved = await this.mediaService.getIsSaved({ id: +id, user_id: +user.sub });
    return successResponse(isSaved, 'Save status retrieved successfully');
  }

  @Post('me/saved/:id')
  async saveMedia(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload
  ) {
    const save = await this.mediaService.saveMedia({ id: +id, user_id: +user.sub });
    return successResponse(save, 'Media saved successfully');
  }

  @Delete('me/saved/:id')
  async unsaveMedia(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload
  ) {
    const save = await this.mediaService.unsaveMedia({ id: +id, user_id: +user.sub });
    return successResponse(save, 'Deleted Saved Media successfully');
  }

  // Soft delete action
  @Delete('me/delete/:id')
  async softRemove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const removed = await this.mediaService.softRemove({
      id: +id,
      user_id: +user.sub,
    });

    return successResponse(removed, 'Media deleted successfully');
  }

  @Get('me/delete')
  async getListSoftRemove(
    @Query() query: MediaQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { data, meta } = await this.mediaService.getListSoftRemove({
      query,
      user_id: +user.sub,
    });

    return successResponse(data, 'Media soft deleted successfully', meta);
  }

  @Post('me/delete/:id/restore')
  async restore(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const restore = await this.mediaService.restore({
      id: +id,
      user_id: +user.sub,
    });

    return successResponse(restore, 'Media re-store successfully');
  }

  // Delete forever
  @Delete('me/delete/:id/force')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const removed = await this.mediaService.remove({
      id: +id,
      user_id: +user.sub,
    });
    return successResponse(removed, 'Media deleted successfully');
  }

  // Media actions
  @Get()
  async findAll(
    @Query() query: MediaQueryDto
  ) {
    const { data, meta } = await this.mediaService.findAll({ query: query });
    return successResponse(data, 'Media list retrieved successfully', meta);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const media = await this.mediaService.findOne(+id);
    return successResponse(media, 'Media retrieved successfully');
  }
}
