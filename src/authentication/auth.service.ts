import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Users from './users.entity';
import { LoginDto } from './auth.dto';
import {
  comparePasswords,
  hashPassword,
  isValidPasswordFormat,
} from '../common/cryptography';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async validateUser(payload: {
    username: string;
    password: string;
  }): Promise<any> {
    const user = await this.findByUsername(payload);

    if (user) {
      const { hash, salt, ...result } = user;
      const validPassword = await comparePasswords(
        payload.password,
        hash,
        salt,
      );
      if (!validPassword) {
        return null;
      }
      return result;
    }
    return user;
  }

  async login(user: LoginDto): Promise<any> {
    const { username, password } = user;
    const validUser = await this.validateUser({ username, password });
    if (!validUser) {
      throw new Error('Invalid username and/or password.');
    }
    const userId = await this.findByUsername(user);
    const payload = { id: userId.id, username: username, password: password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user) {
    const { password, ...rest } = user;

    const targetUsername = await this.findByUsername(rest);
    if (targetUsername) {
      throw new Error('User already exists.');
    }

    const targetEmail = await this.findByEmail(rest);
    if (targetEmail) {
      throw new Error('User already exists.');
    }

    if (!isValidPasswordFormat(password)) {
      throw new Error('Incorrect password.');
    }

    const result = await hashPassword(password);
    await this.usersRepository.insert({ isAdmin: false, ...rest, ...result });

    const newUser = await this.findByUsername(rest);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, salt, ...newRest } = newUser;
    return newRest;
  }

  async findByUsername(user: any): Promise<any> {
    return await this.usersRepository.findOne({ username: user.username });
  }

  async findByEmail(user: any): Promise<any> {
    return await this.usersRepository.findOne({ email: user.email });
  }
}
