import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from '../../user/interface/user.interface';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Request } from 'express';
import { Role } from '../../user/entities/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;

    if (!user?.roles) {
      throw new UnauthorizedException('error getting roles from jwt');
    }

    if (
      !user.roles.includes(Role.ADMIN) &&
      !this.isResourceOwner(user.id, request)
    ) {
      throw new UnauthorizedException(
        'cannot access resources not associated with your account'
      );
    }

    return requiredRoles.some((requiredRole) =>
      user.roles.includes(requiredRole)
    );
  }

  isResourceOwner(userId: string, request: Request) {
    return (
      request.params?.id === userId ||
      request.body?.id === userId ||
      request.query?.id === userId
    );
  }
}
