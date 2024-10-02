import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthUserDto } from './dto/create-auth.dto';

import { prisma } from 'config/prisma';
import { bcryptSalt, findUserByEmail, toJson } from 'utils/helper';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AuthService {
  async register(user: AuthUserDto) {
    try {
      // encrypt password
      user.password = bcrypt.hashSync(user.password, bcryptSalt());

      await prisma.users.create({
        data: {
          ...user,
        },
      });

      return new HttpException({ message: 'User created' }, HttpStatus.OK);
    } catch (error) {
      throw error;
    }
  }

  async login(auth: AuthUserDto) {
    try {
      const user = await findUserByEmail(auth.email);

      const compareHash = bcrypt.compareSync(auth.password, user.password);

      if (compareHash) {
        const response = await prisma.users.findUnique({
          where: { uid: user.uid },
          include: {
            posts: true,
          },
        });

        const token = jsonwebtoken.sign(
          { userId: user.uid },
          process.env.SUPABASE_DB,
          { expiresIn: '1h' },
        );

        const refresh = jsonwebtoken.sign(
          { userId: user.uid },
          process.env.SUPABASE_DB,
          { expiresIn: '1d' },
        );

        return toJson({ user: response, token, refresh });
      } else {
        throw new HttpException(
          { response: { error: 'Password/Email incorrect' } },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
