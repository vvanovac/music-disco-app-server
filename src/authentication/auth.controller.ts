import { Body, Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res() res) {
    try {
      const data = await this.authService.login(body.username, body.password);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }

  @Post('register')
  async register(@Req() req, @Res() res) {
    try {
      const data = await this.authService.register(req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
