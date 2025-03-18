import { Role } from "../entities/role.enum";

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: Role[];
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
