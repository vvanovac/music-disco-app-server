import { Injectable } from '@nestjs/common';
import * as users from '../data/users.json';
import { JwtService } from '@nestjs/jwt';
import IUser from './user.interface';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(payload: {
    username: string;
    password: string;
  }): Promise<any> {
    return users.find(
      (user) =>
        user.username === payload.username &&
        user.password === payload.password,
    );
  }

  async login(user: LoginDto): Promise<any> {
    const { username, password } = user;
    const validUser = await this.validateUser({ username, password });
    if (!validUser) {
      throw new Error('Invalid username and/or password.');
    }
    const payload = { username: username, password: password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user: IUser) {
    const { username, email } = user;

    const existingUser = users.find(
      (user) => user.username === username || user.email === email,
    );
    if (existingUser) {
      throw new Error('User already exists.');
    }

    users.push({ isAdmin: false, ...user });

    return user;
  }
}
