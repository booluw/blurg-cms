import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from 'strategy/jwt.strategy';

@Module({
  imports: [AuthModule, PostsModule, PassportModule],
  controllers: [AppController],
  providers: [AppService, jwtStrategy],
})
export class AppModule {}
