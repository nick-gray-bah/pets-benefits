import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;
}

@ObjectType()
export class RefreshResponse {
  @Field(() => User)
  user: User;
}

@InputType()
export class LoginRequest {
  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  @IsNotEmpty()
  password: string;
}