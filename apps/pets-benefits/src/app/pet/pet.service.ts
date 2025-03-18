import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>
  ) {}

  create(createPetDto: CreatePetDto) {
    return 'This action adds a new pet';
  }

  findAll() {
    return `This action returns all pets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  findByOwnerId(userId: string) {
    return this.petsRepository.findOne({ where: { owner: { id: userId } } });
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`;
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
