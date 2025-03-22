import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Pet } from './entities/pet.entity';
import { PetService } from './pet.service';
import { CreatePetDto, UpdatePetDto } from './dto/pet.input';

@Resolver(() => Pet)
export class PetResolver {
  constructor(private petService: PetService) {}

  @Query(() => Pet)
  async getPet(@Args('id') id: string) {
    return await this.petService.findOne(id);
  }

  @Query(() => [Pet], { name: 'getAllPets' })
  async getAllPets(): Promise<Pet[]> {
    return this.petService.getAllPets();
  }

  @Mutation(() => Pet)
  async createPet(@Args('input') petData: CreatePetDto) {
    return await this.petService.create(petData);
  }

  @Mutation(() => Pet)
  async updatePet(@Args('input') petData: UpdatePetDto) {
    return await this.petService.update(petData);
  }
}
