import { IsUrl } from 'class-validator';

export class UploadImageUrlDto {
    @IsUrl()
    url: string;
}