import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { findUserById } from 'utils/helper';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await findUserById(payload.userId);

    if (!user) {
      return new HttpException(
        'You need to log in to continue',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
