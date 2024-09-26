import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthUserDto } from './dto/create-auth.dto';

import { prisma } from 'config/prisma';
import { bcryptSalt, findUserByEmail } from 'utils/helper';

@Injectable()
export class AuthService {
  async register(user: AuthUserDto) {
    try {
      // encrypt password
      user.password = bcrypt.hashSync(
        user.email + ' ' + user.email,
        bcryptSalt(),
      );

      await prisma.users.create({
        data: {
          ...user,
        },
      });

      return new HttpException({ message: 'User created' }, HttpStatus.OK);
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(auth: AuthUserDto) {
    try {
      const user = await findUserByEmail(auth.email);

      const compareHash = bcrypt.compareSync(auth.password, user.password);

      if (compareHash) {
        return await prisma.users.findUnique({
          where: { uid: user.uid },
          include: {
            posts: true,
          },
        });
      } else {
        throw new HttpException(
          { error: 'Password/Email incorrect' },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
