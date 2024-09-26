import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {}

export class AuthUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  name: string;
}
