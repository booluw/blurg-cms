import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { prisma } from '../config/prisma';

@Injectable()
export class AppService {
  async getHello(): Promise<{ status: string; time: string; version: string }> {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return {
      status: 'Blurg is healthy',
      time: `${new Date().getFullYear()} ${new Date().getMonth()} ${new Date().getDay()}`,
      version: 'v1',
    };
  }
}
