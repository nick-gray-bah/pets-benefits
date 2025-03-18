import { IUser } from '../../user/interface/user.interface';

export interface IPet {
  id?: string;
  name: string;
  owner: IUser;
}
