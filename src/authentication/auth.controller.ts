import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body, @Res() res) {
    try {
      const data = await this.authService.login(body.username, body.password);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  @Post('register')
  async register(@Req() req, @Res() res) {
    try {
      const data = await this.authService.register(req.body);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}
