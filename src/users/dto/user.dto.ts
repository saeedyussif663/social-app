import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'ada@example.com',
    description: 'Unique email address for the account',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'ada_lovelace',
    description: 'Public username shown on posts',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    example: 'StrongPass1!',
    description:
      'Password with uppercase, lowercase, number, and special character',
    minLength: 8,
  })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password!: string;
}

export class LoginUserDto {
  @ApiProperty({
    example: 'ada@example.com',
    description: 'Email used during signup',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'StrongPass1!',
    description: 'Account password',
  })
  @IsString()
  password!: string;
}
