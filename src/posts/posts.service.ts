import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helper';

@Injectable()
export class PostsService {
  async create(post: CreatePostDto, req: any) {
    try {
      const user = await getUserFromRequest(req);
      return await prisma.posts.createManyAndReturn({
        data: {
          ...post,
          authorUid: user.uid,
        },
      });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(req: any) {
    try {
      const user = await getUserFromRequest(req);

      return await prisma.posts.findMany({ where: { authorUid: user.uid } });
    } catch (error) {
      throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      return await prisma.posts.findUnique({ where: { id } });
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
