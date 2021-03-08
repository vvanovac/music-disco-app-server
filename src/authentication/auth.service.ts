import { Injectable } from '@nestjs/common';
import * as users from '../data/users.json';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(payload: {
    username: string;
    password: string;
  }): Promise<any> {
    return users.filter(
      (user) =>
        user.username === payload.username &&
        user.password === payload.password,
    );
  }

  async login(username: string, password: string): Promise<any> {
    const user = await this.validateUser({ username, password });
    if (user.length === 0 || !user) {
      throw new Error('Login Failed');
    }
    const payload = { username: user.username, password: user.password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user) {
    const { username, password } = user;

    if (!username || !password) {
      throw new Error('Username and/or password missing');
    }

    const existingUser = users.filter((user) => user.username === username);

    if (existingUser.length !== 0) {
      throw new Error('User Already Exists');
    }

    users.push(user);

    return user;
  }
}
