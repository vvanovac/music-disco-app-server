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
    const user = await this.findUser({ username: payload.username }, true);
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
    const userId = await this.findUser({ username: username });
    const payload = { id: userId.id, username: username, password: password };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user) {
    const { password, ...rest } = user;

    const targetUsername = await this.findUser({ username: rest.username });
    if (targetUsername) {
      throw new Error('User already exists.');
    }

    const targetEmail = await this.findUser({ email: rest.email });
    if (targetEmail) {
      throw new Error('User already exists.');
    }

    if (!isValidPasswordFormat(password)) {
      throw new Error('Incorrect password.');
    }

    const result = await hashPassword(password);
    await this.usersRepository.insert({ isAdmin: false, ...rest, ...result });

    return await this.findUser(rest);
  }

  async findUser(user: any, addHashSalt?): Promise<any> {
    return await this.usersRepository.findOne(user, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      select: ['id', 'username', 'email', 'isAdmin'].concat(
        addHashSalt ? ['hash', 'salt'] : [],
      ),
    });
  }
}
