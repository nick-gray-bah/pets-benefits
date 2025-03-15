import { IsEmail, IsJWT, IsNotEmpty } from 'class-validator';

export class AuthRequestDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AuthResponseDTO {
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;
}
