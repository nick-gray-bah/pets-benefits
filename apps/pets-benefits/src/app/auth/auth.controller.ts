import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequestDTO } from './dto/auth.dto';
import { AuthedRequest } from './interfaces/interfaces';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  async authenticate(@Body() authDTO: AuthRequestDTO) {
    return await this.authService.authenticate(authDTO);
  }


  @Get('roles/:id')
  getRoles(@Req() req: AuthedRequest) {
    return this.authService.getRoles(req)
  }
}
