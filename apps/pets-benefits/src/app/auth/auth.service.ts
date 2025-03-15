import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthRequestDTO, AuthResponseDTO } from './dto/auth.dto';
import { AuthedRequest, IPayload, Role } from './interfaces/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async authenticate(authDTO: AuthRequestDTO): Promise<AuthResponseDTO> {
    const { email, password } = authDTO;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    const correctPassword = await user.comparePassword(password);

    if (correctPassword) {
      const payload: IPayload = {
        id: user.id,
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

  getRoles(req: AuthedRequest): Role[] {
    if (!req.user || !req.user.roles) {
      throw new UnauthorizedException();
    }
    return req.user.roles;
  }
}
