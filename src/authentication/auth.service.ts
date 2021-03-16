import { Injectable } from '@nestjs/common';
import * as users from '../data/users.json';
import { JwtService } from '@nestjs/jwt';
import IUser from './user.interface';

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

  async login(username: string, password: string): Promise<any> {
    const user = await this.validateUser({ username, password });
    if (!user) {
      throw new Error('Invalid username and/or password.');
    }
    const payload = { username: user.username, password: user.password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user: IUser) {
    const { username, password, email } = user;

    if (!username) {
      throw new Error('Username is missing.');
    }
    if (!password) {
      throw new Error('Password is missing.');
    }
    if (!email) {
      throw new Error('Email is missing.');
    }
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters long.');
    }
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const existingUser = users.find(
      (user) => user.username === username || user.email === email,
    );

    if (existingUser) {
      throw new Error('User already exists.');
    }

    users.push({ ...user, isAdmin: false });

    return user;
  }
}
