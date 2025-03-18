import { Request } from 'express';
import { Role } from '../../user/entities/role.enum';

export interface IPayload {
  sub: string;
  email: string;
  roles: Role[];
}

export interface AuthedRequest extends Request {
  user: IPayload;
}