import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '../user/entities/user.entity';
import { LoginRequest, LoginResponse, RefreshResponse } from './dto/auth.dto';
import { IPayload } from './interfaces/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authenticate(
    authDTO: LoginRequest,
    res: Response
  ): Promise<LoginResponse> {
    const { email, password } = authDTO;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const correctPassword = await user.comparePassword(password);

    if (!correctPassword) {
      throw new UnauthorizedException('incorrect password');
    }

    const payload: IPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    await this.userRepository.save({ ...user, refreshToken: refreshToken });
    this.setTokenCookies(res, accessToken, refreshToken);

    return { user };
  }

  async logout(res: Response) {
    this.clearTokenCookies(res);
    return { success: true };
  }

  async refreshTokens(req: Request, res: Response): Promise<RefreshResponse> {
    const { refreshToken } = this.extractTokenFromCookies(req);

    if (!refreshToken) {
      throw new UnauthorizedException('missing refresh token');
    }

    try {
      const payload = await this.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findOneBy({
        id: payload.sub,
      });

      if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
        this.clearTokenCookies(res);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: IPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const accessToken = await this.generateAccessToken(newPayload);
      const newRefreshToken = await this.generateRefreshToken(newPayload);

      await this.userRepository.save({ ...user, refreshToken: refreshToken });

      this.setTokenCookies(res, accessToken, newRefreshToken);

      return { user };
    } catch (err) {
      this.clearTokenCookies(res);
      throw new InternalServerErrorException(err);
    }
  }

  private extractTokenFromCookies(req: Request): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: req.cookies?.['access_token'],
      refreshToken: req.cookies?.['refresh_token'],
    };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<IPayload> {
    try {
      return await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateAccessToken(payload: IPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
    });
  }

  private async generateRefreshToken(payload: IPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string
  ): void {
    const secure = this.configService.get('NODE_ENV') === 'production';
    const domain = this.configService.get('COOKIE_DOMAIN');

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      domain,
      path: '/',
      maxAge: this.parseExpirationToMs(
        this.configService.get('JWT_ACCESS_EXPIRATION')
      ),
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      domain,
      path: '/graphql',
      maxAge: this.parseExpirationToMs(
        this.configService.get('JWT_REFRESH_EXPIRATION')
      ),
    });
  }

  private clearTokenCookies(res: Response): void {
    const domain = this.configService.get('COOKIE_DOMAIN');

    res.cookie('access_token', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      domain,
      path: '/',
      maxAge: 0,
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      domain,
      path: '/graphql',
      maxAge: 0,
    });
  }

  private parseExpirationToMs(expiration: string): number {
    const value = parseInt(expiration.slice(0, -1), 10);
    const unit = expiration.slice(-1);

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return 24 * 60 * 60 * 1000;
    }
  }
}
