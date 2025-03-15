import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from '../../user/interface/user.interface';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../interfaces/interfaces';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!(roles || roles.length)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (!user || !user.roles) {
      throw new UnauthorizedException('error getting roles from jwt');
    }

    // if the user is not an admin, ensure they only access resources that match their id
    const notAdmin = user.roles.every((role) => role !== Role.admin);

    if (notAdmin && !this.isResourceOwner(user.id, request)) {
      throw new UnauthorizedException(
        'cannot access resources not associated with your account'
      );
    }

    return roles.some((role) => user.roles.includes(role));
  }

  isResourceOwner(id: string, request: Request) {
    if (request.params?.id && request.params.id === id) return true;
    else if (request.body?.id === id) return true;
    else if (request.query?.id === id) return true;
    return false;
  }
}
