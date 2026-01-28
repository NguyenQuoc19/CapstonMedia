import { IsNumber } from 'class-validator';
import { ProfileDto } from './profile.dto';

export class MeDto {
    @IsNumber()
    sub: number;
    roles: string[];
    body?: ProfileDto
}
