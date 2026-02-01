import { UserStatus } from '@/generated/prisma/enums';
import {
  IsUrl,
  Length,
  IsEnum,
  IsEmail,
  Matches,
  IsString,
  IsOptional,
} from 'class-validator';

export class ProfileDto {
  @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Email is not valid' })
  @IsOptional()
  email?: string;

  @IsEnum(UserStatus, { message: 'Status is not valid' })
  @IsOptional()
  status?: UserStatus;

  // @IsUrl()
  // @Matches(/\.(jpg|jpeg|png|gif|webp)$/i, { message: 'Avatar must be an image URL' })
  @IsOptional()
  avatar: string;
}
