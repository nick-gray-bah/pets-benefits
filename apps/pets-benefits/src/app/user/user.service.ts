import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findUserById(id: string) {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneByOrFail({ email });
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async createUser(user: CreateUserDTO) {
    const exists = await this.usersRepository.findOneBy({ email: user.email });
    if (exists) {
      throw new NotAcceptableException(`email: ${user.email} already in use`);
    }

    try {
      const newUser = await this.usersRepository.save(
        this.usersRepository.create(user)
      );
      delete newUser.password;
      return newUser;
    } catch (error) {
      if (error.message.includes('duplicate key value')) {
        throw new NotAcceptableException('Email is already in use.');
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the user.'
      );
    }
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    return this.usersRepository.delete({ id: user.id });
  }

  async updateUser(userData: UpdateUserDTO): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({
      id: userData.id,
    });

    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async removeAll() {
    const entities = await this.getAllUsers();
    return await this.usersRepository.remove(entities);
  }
}
