import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pet } from '../../pet/entities/pet.entity';
import { Role } from './role.enum';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { IUser } from '../interface/user.interface';

@ObjectType()
@Entity('users')
export class User implements IUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @HideField()
  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [Role])
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.OWNER] })
  roles: Role[];

  @Field(() => [Pet])
  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password && !this.isPasswordHashed(this.password)) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.password);
  }

  private isPasswordHashed(password: string): boolean {
    return password.startsWith('$2');
  }
}
