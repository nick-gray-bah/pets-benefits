import { Module } from '@nestjs/common';
import { PetsService } from './pet.service';
import { PetsController } from './pet.controller';
import { PetEntity } from './entities/pet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PetEntity])],
  exports: [TypeOrmModule],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {}
