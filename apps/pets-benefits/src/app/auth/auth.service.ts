import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthRequestDTO, AuthResponseDTO } from './dto/auth.dto';
import { AuthedRequest, IPayload } from './interfaces/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async authenticate(authDTO: AuthRequestDTO): Promise<AuthResponseDTO> {
    const { email, password } = authDTO;

    const user = await this.userRepository.findOneOrFail({ where: { email } });
    const correctPassword = await user.comparePassword(password);

    if (correctPassword) {
      const payload: IPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  getRoles(req: AuthedRequest) {
    if (!req.user || !req.user.roles) {
      throw new UnauthorizedException();
    }
    return req.user.roles;
  }

  async getUserFromJwt(accessToken: string) {
    try {
      const decoded = this.jwtService.verify(accessToken);
      return await this.userRepository.findOneBy({ id: decoded.sub });
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
