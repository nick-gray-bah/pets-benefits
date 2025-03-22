import { forwardRef, Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet } from './entities/pet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetResolver } from './pet.resolver';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet]), forwardRef(() => UserModule)],
  exports: [TypeOrmModule],
  providers: [PetResolver, PetService],
})
export class PetModule {}
