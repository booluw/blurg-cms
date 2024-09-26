import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { prisma } from 'config/prisma';

@Injectable()
export class AuthService {
  async create(user: AuthUserDto) {
    try {
      // encrypt password
      // user.password = bcrypt
      await prisma.users.create({
        data: {
          ...user,
        },
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
