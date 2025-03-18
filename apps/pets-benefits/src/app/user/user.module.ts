import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { PetsModule } from '../pet/pet.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [PetsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserResolver,
    UserService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
