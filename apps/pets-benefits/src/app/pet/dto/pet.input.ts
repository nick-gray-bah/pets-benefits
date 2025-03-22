import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class CreatePetDto {
  @Field()
  name: string;

  @Field()
  breed: string;

  @Field(() => Date)
  dob: Date;

  @Field()
  ownerId: string;
}

@InputType()
export class UpdatePetDto extends PartialType(CreatePetDto) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
