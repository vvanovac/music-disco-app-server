import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;
}
