import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'admin',
  OWNER = 'owner',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User roles',
});