import { Request } from 'express';

export interface IPayload {
  id: string;
  email: string;
  roles: Role[];
}

export interface AuthedRequest extends Request {
  user: IPayload;
}

export enum Role {
  admin = 'admin',
  owner = 'owner',
}