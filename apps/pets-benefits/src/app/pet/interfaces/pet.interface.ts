import { IUser } from '../../user/interface/user.interface';

export interface Pet {
  id?: string;
  name: string;
  owner: IUser;
}
