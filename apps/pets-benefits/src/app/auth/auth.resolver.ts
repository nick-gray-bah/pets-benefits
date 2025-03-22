import {
  Resolver,
  Mutation,
  Query,
  Args,
  Context,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse, RefreshResponse } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { Request, Response } from 'express';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() { res }: { res: Response }
  ): Promise<LoginResponse> {
    return this.authService.authenticate({ email, password }, res);
  }

  @Public()
  @Mutation(() => LoginResponse)
  async refreshToken(
    @Context() { req, res }: { req: Request, res: Response }
  ): Promise<RefreshResponse> {
    return await this.authService.refreshTokens(req, res);
  }

  @Query(() => String)
  hello(): string {
    return 'hello';
  }
}
