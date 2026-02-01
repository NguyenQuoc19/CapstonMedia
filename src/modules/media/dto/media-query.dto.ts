import { Type } from 'class-transformer';
import { BaseQueryDto } from '@/shared/dto/base-query.dto';
import { MediaPrivacy, MediaType } from '@/generated/prisma/enums';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class MediaQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsEnum(MediaType)
    type?: MediaType;

    @IsOptional()
    @IsString()
    caption?: string;

    @IsOptional()
    @IsEnum(MediaPrivacy)
    privacy?: MediaPrivacy;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    user_id?: number;
}