import { Pet } from "../../pet/entities/pet.entity";
import { Role } from "../entities/role.enum";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roles: Role[];
  pets: Pet[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
