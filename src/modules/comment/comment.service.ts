import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { prismaPaginate } from '@/shared/prisma/helper/prisma-query.helper';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create({
    body,
    user_id
  }: {
    body: CreateCommentDto,
    user_id: number
  }) {
    const { media_id, content } = body;

    const findMedia = await this.prisma.media.findUnique({ where: { id: media_id, deleted_at: null } });
    if (!findMedia) throw new NotFoundException("Could not found the media request");

    const data: Prisma.CommentCreateInput = {
      user: { connect: { id: user_id } },
      media: { connect: { id: media_id } },
      content,
    };

    if (body.parent_id) {
      const findParent = await this.prisma.comment.findUnique({ where: { id: body.parent_id, deleted_at: null } });
      if (!findParent) throw new NotFoundException("Could not found the comment parent request");

      if (Number(findParent.media_id) !== media_id) throw new BadRequestException('The parent comment does not belong to the specified media');

      data.parent = { connect: { id: body.parent_id }, };
    }

    const comment = await this.prisma.comment.create({ data });

    if (!comment) throw new BadRequestException('Failed to permanently create the comment. Please try again later.');
    return comment;
  }

  async getMediaComment(mediaId: number) {
    return prismaPaginate({
      page: 1,
      limit: 50,
      model: this.prisma.comment,
      where: {
        media: {
          id: mediaId,
          deleted_at: null
        },
        deleted_at: null
      },
      include: { parent: true },
      orderBy: { created_at: "desc" },
    });
  }

  async remove({
    id,
    user_id
  }: {
    id: number,
    user_id: number
  }) {
    const findComment = await this.prisma.comment.findUnique({ where: { id, user_id } });
    if (!findComment) throw new NotFoundException('Comment not found or you do not have permission to access it');

    const removeComment = await this.prisma.comment.delete({
      where: {
        id,
        user_id
      }
    });

    if (!removeComment) throw new BadRequestException('Failed to permanently deleted the comment. Please try again later.');

    return removeComment ? true : false;
  }
}
