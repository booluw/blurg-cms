import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { isEmail, isEmpty } from 'class-validator';
import { prisma } from 'config/prisma';
import * as jsonwebtoken from 'jsonwebtoken';

export function bcryptSalt() {
  return bcrypt.genSaltSync(10);
}

export async function findUserById(uid: string) {
  if (isEmpty(uid)) {
    throw Error('Please provide a valid userId');
  }

  try {
    const user = await prisma.users.findUnique({ where: { uid } });

    if (isEmpty(user)) throw Error('User not found');
    return user;
  } catch (error) {
    throw Error(error);
  }
}

export async function findUserByEmail(email: string) {
  if (!isEmail(email)) {
    throw Error('This is not a valid email');
  }

  try {
    const user = await prisma.users.findUnique({ where: { email } });

    if (isEmpty(user)) {
      throw new HttpException(
        { error: 'User does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  } catch (error) {
    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function getUserFromRequest(req: any) {
  if (isEmpty(req.headers.authorization)) {
    throw Error('You must be logged in');
  }

  const userId = jsonwebtoken.verify(
    req.headers.authorization.split(' ')[1],
    process.env.SUPABASE_DB,
  ) as any;

  try {
    return await findUserById(userId.userId);
  } catch (error) {
    throw Error(error);
  }
}

export const toJson = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value), // return everything else unchanged
  );
};
