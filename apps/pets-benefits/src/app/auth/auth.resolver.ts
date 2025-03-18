import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponseDTO)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponseDTO> {
    return await this.authService.authenticate({ email, password });
  }

  @Query(() => String)
  hello(): string {
    return 'hello';
  }
}
