import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt.auth.guard';
import AuthService from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';

@Controller()
export default class AuthController {
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

  @UseGuards(JwtAuthGuard)
  @Get('currentUser')
  async getUser(@Req() req, @Res() res) {
    try {
      const user = await this.authService.findUser({
        id: req.user.id,
        username: req.user.username,
      });
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
