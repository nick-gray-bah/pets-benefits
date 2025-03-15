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
import { PetEntity } from '../../pet/entities/pet.entity';
import { Role } from '../../auth/interfaces/interfaces';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('text', { array: true, nullable: true })
  roles: Role[];

  @OneToMany(() => PetEntity, (pet) => pet.owner)
  pets: PetEntity[];

  @CreateDateColumn()
  createdAt: Date;

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
