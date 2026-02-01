import { PaginationDto } from './pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class BaseQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc';
}
