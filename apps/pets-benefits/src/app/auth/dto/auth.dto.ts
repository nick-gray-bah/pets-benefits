import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsJWT, IsNotEmpty } from 'class-validator';

@InputType()
export class AuthRequestDTO {

  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}

@ObjectType()
export class AuthResponseDTO {
  
  @IsNotEmpty()
  @IsJWT()
  @Field()
  accessToken: string;
}
