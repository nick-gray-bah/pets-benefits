import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  getRequest(context: ExecutionContext) {
    
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    if (context.getType() === 'ws') {
      const ctx = GqlExecutionContext.create(context);
      const connectionParams = ctx.getContext().connectionParams;

      if (connectionParams?.Authorization) {
        const token = connectionParams.Authorization.replace('Bearer ', '');
        try {
          const user = this.jwtService.verify(token);
          ctx.getContext().user = user;
          return { user };
        } catch (err) {
          console.log(err);
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
      throw new UnauthorizedException('Missing authentication token');
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
