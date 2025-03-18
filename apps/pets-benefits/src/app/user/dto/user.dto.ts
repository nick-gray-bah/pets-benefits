import {
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Role } from '../entities/role.enum';

@InputType()
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsOptional()
  @Field({ nullable: true })
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @Field(() => [Role])
  roles?: Role[];

  @IsStrongPassword(
    { minLength: 15, minLowercase: 1, minUppercase: 1, minSymbols: 1 },
    {
      message:
        'password requirements: minLength: 15, minLowerCase: 1, minUpperCase: 1, minSymbols: 1',
    }
  )
  @Field()
  password: string;
}

@InputType()
export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsUUID()
  id: string;
}
