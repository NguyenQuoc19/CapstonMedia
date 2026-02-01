import { MediaType, MediaPrivacy } from '@/generated/prisma/enums';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
    @IsOptional()
    @IsIn(Object.values(MediaType), {
        message: 'type must be either "image", "video" or "audio"',
    })
    type?: MediaType;

    @IsOptional()
    @IsIn(Object.values(MediaPrivacy), {
        message: 'privacy must be either "public" or "friend"',
    })
    privacy?: MediaPrivacy;

    @IsOptional()
    @IsString()
    caption?: string;
}