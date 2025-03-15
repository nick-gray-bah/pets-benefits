import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async findUserById(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async createUser(user: CreateUserDTO) {
    const exists = await this.findUserByEmail(user.email);
    if (exists) {
      throw new NotAcceptableException(
        `account already exists with email ${user.email}`
      );
    }
    const newUser = this.usersRepository.create(user);
    const savedUser = await this.usersRepository.save(newUser);
    delete savedUser.password;
    return savedUser;
  }

  async deleteUser(id: string) {
    return this.usersRepository.delete({ id });
  }

  async updateUser(id: string, user: UpdateUserDTO) {
    return this.usersRepository.update(id, user);
  }

  async removeAll() {
    const entities = await this.getAllUsers();
    return this.usersRepository.remove(entities)
  }
}
