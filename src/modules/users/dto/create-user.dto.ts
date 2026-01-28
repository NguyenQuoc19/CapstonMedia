import { IsEmail, IsOptional, IsString, IsStrongPassword, IsUrl, Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
        },
    )
    password: string;

    @IsUrl()
    @Matches(/\.(jpg|jpeg|png|gif|webp)$/i, { message: 'Avatar must be an image URL' })
    @IsOptional()
    avatar: string;
}
