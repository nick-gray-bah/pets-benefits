import {
  Resolver,
  Query,
  ResolveField,
  Parent,
  Args,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Pet } from '../pet/entities/pet.entity';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { Public } from '../auth/decorators/public.decorator';
import { Inject } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(Pet) private readonly petRepository: Repository<Pet>,
    @Inject('PUB_SUB') private pubSub: PubSub,
    private userService: UserService
  ) {}

  @Query(() => [User])
  users() {
    return this.userService.getAllUsers();
  }

  @Query(() => User)
  user(@Args('id') id: string) {
    return this.userService.findUserById(id);
  }

  @ResolveField(() => [Pet], { nullable: true })
  pets(@Parent() user: User) {
    return this.petRepository.find({
      where: { owner: { id: user.id } },
      relations: ['owner'],
    });
  }

  @Public()
  @Mutation(() => User)
  async createUser(@Args('user') user: CreateUserDTO) {
    const newUser = await this.userService.createUser(user);
    this.pubSub.publish('userAdded', { userAdded: newUser });
    return newUser;
  }

  @Mutation(() => User)
  async updateUser(@Args('user') user: UpdateUserDTO) {
    const updatedUser = await this.userService.updateUser(user);
    this.pubSub.publish('userAdded', { userUpdated: updatedUser });
    return user;
  }

  @Subscription(() => User)
  userAdded() {
    return this.pubSub.asyncIterableIterator('userAdded');
  }

  @Subscription(() => User)
  userUpdated() {
    return this.pubSub.asyncIterableIterator('userUpdated');
  }
}
