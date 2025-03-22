import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePetDto, UpdatePetDto } from './dto/pet.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    private userService: UserService
  ) {}

  async create(createPetDto: CreatePetDto) {
    const { name, ownerId } = createPetDto;
    const owner = await this.userService.findUserById(ownerId);

    if (!owner) {
      throw new NotFoundException('owner not found');
    }

    const exists = this.petsRepository.findOne({
      where: {
        name,
        owner: { id: ownerId },
      },
      relations: ['owner'],
    });

    if (exists) {
      throw new NotAcceptableException(
        `pet with name: ${name} already exists for ownerId: ${ownerId}`
      );
    }

    const newPet = this.petsRepository.create({
      name,
      owner,
      breed: createPetDto.breed,
      dob: createPetDto.dob,
    });

    return await this.petsRepository.save(newPet);
  }

  async getAllPets() {
    return await this.petsRepository.find();
  }

  async findOne(id: string) {
    return await this.petsRepository.findOneByOrFail({ id });
  }

  findByOwnerId(userId: string) {
    return this.petsRepository.findOneByOrFail({ owner: { id: userId } });
  }

  async update(updatePetDto: UpdatePetDto) {
    const pet = await this.petsRepository.findOneByOrFail({
      id: updatePetDto.id,
    });

    Object.assign(pet, updatePetDto);
    return this.petsRepository.save(pet);
  }

  async delete(id: string) {
    await this.petsRepository.findOneByOrFail({ id });
    return await this.petsRepository.delete({ id });
  }
}
