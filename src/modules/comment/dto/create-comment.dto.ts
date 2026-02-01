import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    media_id: number;

    @IsString()
    content: string

    @IsOptional()
    @IsNumber()
    parent_id?: number;
}
