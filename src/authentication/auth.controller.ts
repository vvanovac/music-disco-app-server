import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res) {
    try {
      const data = await this.authService.login(body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res) {
    try {
      const data = await this.authService.register(body);
      return res.status(HttpStatus.CREATED).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
