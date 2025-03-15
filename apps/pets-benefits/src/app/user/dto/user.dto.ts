import { IsNotEmpty, IsEmail, IsStrongPassword, IsOptional, IsString, IsArray } from 'class-validator';
import { Role } from '../../auth/interfaces/interfaces';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  roles: Role[];

  @IsStrongPassword(
    { minLength: 15, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
    { message: 'password requirements: minLength: 15, minLowerCase: 1, minUpperCase: 1, minSymbols: 1' }
  )
  password: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  roles: Role[];

  @IsOptional()
  @IsStrongPassword(
    { minLength: 15, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
    { message: 'password requirements: minLength: 15, minLowerCase: 1, minUpperCase: 1, minSymbols: 1' }
  )
  password: string;
}
