import { PrismaService } from '@/shared/prisma/prisma.service';
import { UploadService } from '@/shared/upload/upload.service';
import { MediaQueryDto } from './dto/media-query.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaType, Prisma } from '@/generated/prisma/client';
import { buildWhere, prismaPaginate } from '@/shared/prisma/helper/prisma-query.helper';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) { }

  // Account action
  async upload({
    file,
    body,
    user_id,
  }: {
    file: Express.Multer.File;
    body: UploadMediaDto;
    user_id: number | string;
  }) {
    if (!file) throw new BadRequestException("File is required");

    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Invalid file type');

    const { key, url, size } = await this.uploadService.uploadImage(file);

    const { type, privacy, caption } = body;
    const media = await this.prisma.media.create({
      data: {
        type: type ?? MediaType.image,
        url: key,
        privacy,
        user_id: +user_id,
        thumbnail: url,
        caption
      },
    });

    return media;
  }

  async findAllOfUser({
    query,
    user_id,
  }: {
    query?: MediaQueryDto;
    user_id: number | string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query ?? {};

    const where: Prisma.MediaWhereInput = {
      user_id: +user_id,
      deleted_at: null,
      ...buildWhere<Prisma.MediaWhereInput>(query ?? {}, {
        type: 'equal',
        privacy: 'equal',
        caption: 'contains',
      }),
    };

    return prismaPaginate({
      page,
      limit,
      model: this.prisma.media,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async update({
    id,
    body,
    user_id,
  }: {
    id: number,
    body: UploadMediaDto;
    user_id: number;
  }) {
    const media = await this.prisma.media.findFirst({ where: { id: id, user_id: user_id, deleted_at: null } });

    if (!media) throw new BadRequestException('Media not found or you do not have permission to access it');

    const { caption, privacy } = body;
    const update = await this.prisma.media.update({
      where: { id: id, user_id: user_id, deleted_at: null },
      data: { caption, privacy }
    })

    return update;
  }

  // Saved Media
  async getListSaved({
    query,
    user_id
  }: {
    query: MediaQueryDto,
    user_id: number;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query ?? {};

    const where: Prisma.MediaWhereInput = {
      deleted_at: null,
      savedBy: { some: { user_id }, },
      ...buildWhere<Prisma.MediaWhereInput>(query ?? {}, {
        type: 'equal',
        privacy: 'equal',
        caption: 'contains',
      }),
    };

    return prismaPaginate({
      page,
      limit,
      model: this.prisma.media,
      where,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async getIsSaved({
    id,
    user_id
  }: {
    id: number,
    user_id: number | string;
  }) {
    const isSaved = await this.prisma.savedMedia.findUnique({
      where: {
        user_id_media_id: {
          user_id: +user_id, media_id: id
        }
      }
    });
    return isSaved ? true : false;
  }

  async saveMedia({
    id,
    user_id
  }: {
    id: number,
    user_id: number | string;
  }) {
    const findMeida = await this.prisma.media.findUnique({ where: { id, deleted_at: null }, select: { id: true, user_id: true } });

    if (!findMeida) throw new NotFoundException('Media not found or has been deleted');
    if (Number(findMeida.user_id) === +user_id) throw new BadRequestException('You cannot save your own media.');

    const saved = await this.prisma.savedMedia.create({
      data: {
        user_id: +user_id,
        media_id: id
      }
    });

    if (!saved) throw new BadRequestException("Failed to save the media. Please try again later");
    return saved;
  }

  // Soft Delete Media
  async unsaveMedia({
    id,
    user_id
  }: {
    id: number,
    user_id: number | string;
  }) {
    const find = await this.getIsSaved({ id, user_id });

    if (find === false) throw new NotFoundException('This media is not in your saved list');

    const deleteSaved = await this.prisma.savedMedia.delete({
      where: {
        user_id_media_id: {
          user_id: +user_id,
          media_id: id
        }
      }
    });

    if (!deleteSaved) throw new BadRequestException('Failed to remove the media from your saved list. Please try again later');

    return deleteSaved;
  }

  async softRemove({
    id,
    user_id
  }: {
    id: number,
    user_id: number
  }) {
    const media = await this.prisma.media.findFirst({
      where: {
        id: id,
        user_id: user_id
      }
    });

    if (!media) throw new BadRequestException('Media not found or you do not have permission to access it');

    const remove = await this.prisma.media.update({
      where: {
        id: id,
        user_id: user_id
      },
      data: {
        deleted_at: new Date()
      }
    });

    if (!remove) throw new BadRequestException("Have error while delete media requested");

    return remove ? true : false;
  }

  async getListSoftRemove({
    query,
    user_id
  }: {
    query?: MediaQueryDto,
    user_id: number
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query ?? {};

    const where: Prisma.MediaWhereInput = {
      user_id: +user_id,
      deleted_at: { not: null },
      ...buildWhere<Prisma.MediaWhereInput>(query ?? {}, {
        type: 'equal',
        privacy: 'equal',
        caption: 'contains',
      }),
    };

    return prismaPaginate({
      page,
      limit,
      model: this.prisma.media,
      where,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async restore({
    id,
    user_id
  }: {
    id: number,
    user_id: number
  }) {
    const media = await this.prisma.media.findFirst({
      where: {
        id: id,
        user_id: user_id,
        deleted_at: { not: null }
      }
    });

    if (!media) throw new NotFoundException('Media not found or you do not have permission to access it');

    const restore = await this.prisma.media.update({
      where: {
        id: id,
        user_id: user_id,
        deleted_at: { not: null }
      },
      data: {
        deleted_at: null
      }
    });

    if (!restore) throw new BadRequestException("Have error while restore media requested");

    return restore;
  }

  // Delete forever
  async remove({
    id,
    user_id
  }: {
    id: number,
    user_id: number
  }) {
    const media = await this.prisma.media.findFirst({ where: { id: id, user_id: user_id } });

    if (!media) throw new BadRequestException('Media not found or you do not have permission to access it');
    if (media.deleted_at === null) throw new BadRequestException('This media has not been soft deleted and cannot be permanently removed');

    const remove = await this.prisma.media.delete({
      where: {
        id: id,
        user_id: user_id
      }
    });

    if (!remove) throw new BadRequestException('Failed to permanently delete the media. Please try again later.');

    return remove ? true : false;
  }

  // Media Action
  async findAll({
    query
  }: {
    query?: MediaQueryDto;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = query ?? {};

    const where: Prisma.MediaWhereInput = {
      deleted_at: null,
      ...buildWhere<Prisma.MediaWhereInput>(query ?? {}, {
        type: 'equal',
        user_id: 'equal',
        privacy: 'equal',
        caption: 'contains',
      }),
    };

    return prismaPaginate({
      page,
      limit,
      model: this.prisma.media,
      where,
      orderBy: { [sortBy]: sortOrder },
    });
  }

  async findOne(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id }, include: { user: true, comments: true } });
    if (!media) throw new NotFoundException("The media request could not found");
    return media;
  }
}
