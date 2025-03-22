import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IPet } from '../interfaces/pet.interface';

@ObjectType()
@Entity('pets')
export class Pet implements IPet {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  breed: string;

  @Field(() => Date)
  @Column()
  dob: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.pets, { onDelete: 'CASCADE' })
  owner: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
