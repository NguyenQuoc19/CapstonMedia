import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { successResponse } from '@/shared/response';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';

import type { JwtPayload } from '@/common/types/jwt-payload.type';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  async create(
    @Body() body: CreateCommentDto,
    @CurrentUser() user: JwtPayload
  ) {
    const comment = await this.commentService.create({ body, user_id: +user.sub });
    return successResponse(comment, "Comment created successfully");
  }

  @Get('media/:media')
  async getMediaComment(@Param('media', ParseIntPipe) media: number) {
    const { data, meta } = await this.commentService.getMediaComment(media);
    return successResponse(data, "Comment retrieved successfully", meta);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload
  ) {
    const removeComment = await this.commentService.remove({ id, user_id: +user.sub });
    return successResponse(removeComment, "Comment deleted successfully");
  }
}
