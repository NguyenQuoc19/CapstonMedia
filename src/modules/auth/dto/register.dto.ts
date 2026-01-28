import { IsEmail, IsString, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    name: string

    @IsEmail()
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
}