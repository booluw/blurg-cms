import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { prisma } from 'config/prisma';
import { getUserFromRequest, toJson } from 'utils/helper';

@Injectable()
export class PostsService {
  async create(post: CreatePostDto, req: any) {
    try {
      const user = await getUserFromRequest(req);
      const response = await prisma.posts.createManyAndReturn({
        data: {
          ...post,
          authorUid: user.uid,
        },
      });

      return toJson(response);
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const user = await getUserFromRequest(req);

      return toJson(
        await prisma.posts.findMany({
          where: { authorUid: user.uid },
          include: { author: true },
        }),
      );
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllUserPosts(userid: string) {
    try {
      return toJson(
        await prisma.posts.findMany({
          where: { authorUid: userid },
          include: { author: true },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      );
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      return toJson(
        await prisma.posts.findUnique({
          where: { id },
          include: { author: true },
        }),
      );
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data: CreatePostDto, req: any) {
    try {
      const user = await getUserFromRequest(req);
      const post = await prisma.posts.findUnique({ where: { id } });

      if (post.authorUid !== user.uid) {
        return new HttpException(
          { error: 'You cannot edit this post' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      await prisma.posts.update({
        where: {
          id,
          authorUid: user.uid,
        },
        data: {
          ...data,
        },
      });

      return { message: 'Post updated' };
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number, req: any) {
    try {
      const user = await getUserFromRequest(req);
      const post = await prisma.posts.findUnique({ where: { id } });

      if (user.uid !== post.authorUid) {
        return new HttpException({ error: '' }, HttpStatus.UNAUTHORIZED);
      }

      await prisma.posts.delete({ where: { id } });

      return { message: 'Post deleted' };
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
