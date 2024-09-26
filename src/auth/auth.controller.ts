import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() auth: AuthUserDto) {
    return this.authService.register(auth);
  }

  @Post('/login')
  remove(@Body() auth: AuthUserDto) {
    return this.authService.login(auth);
  }
}
