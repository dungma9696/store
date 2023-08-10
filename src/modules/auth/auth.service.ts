import { Injectable, UnauthorizedException } from '@nestjs/common';
import { omit } from 'lodash';
import * as jwt from 'jsonwebtoken';
import CONFIG from '../../configs/app.config';
import { UsersRepository } from '../users/user.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  async login(loginDto: LoginDto) {
    const { numberPhone, password } = loginDto;
    const user = await this.userRepository.TSchema.findOne({
      numberPhone,
    });

    if (!user) {
      throw new UnauthorizedException('auth.USER_OR_PASS_INVALID');
    }
    if (!user.comparePassword(password)) {
      throw new UnauthorizedException('auth.USER_OR_PASS_INVALID');
    }
    const userResponse = omit(user.toObject(), ['password']);

    const token = await jwt.sign(
      {
        data: userResponse,
      },
      CONFIG.ENV.SHARE.SECURE.JWT.JWT_SECRET,
      {
        expiresIn: CONFIG.ENV.SHARE.SECURE.JWT.TOKEN_EXPIRE,
      }
    );
    return {
      token,
      exp:
        Math.floor(Date.now() / 1000) +
        CONFIG.ENV.SHARE.SECURE.JWT.TOKEN_EXPIRE,
      user: userResponse,
    };
  }
}
