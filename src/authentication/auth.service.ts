import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Users from './users.entity';
import { IFindUserAdditionalOptions, ILogin, ILoginUser, IUser } from './user.interface';
import { comparePasswords, hashPassword, isValidPasswordFormat } from '../common/cryptography';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async validateUser(payload: ILoginUser): Promise<IUser> {
    const user = await this.findUser({ username: payload.username }, { addHashSalt: true });
    if (user) {
      const { hash, salt, ...result } = user;
      const validPassword = await comparePasswords(payload.password, hash, salt);
      if (!validPassword) {
        return null;
      }
      return result;
    }
    return user;
  }

  async login({ username, password }: ILoginUser): Promise<ILogin> {
    const validUser = await this.validateUser({ username, password });
    if (!validUser) {
      throw new Error('Invalid username and/or password.');
    }
    const user = await this.findUser({ username: username }, { addID: true });
    const payload = { id: user.id, username: username, isAdmin: user.isAdmin };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user: IUser): Promise<IUser> {
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

  async findUser(user: Partial<IUser>, { addHashSalt, addID }: IFindUserAdditionalOptions = {}): Promise<IUser> {
    const select: (keyof Users)[] = ['username', 'email', 'isAdmin'];
    if (addHashSalt) {
      select.push('hash', 'salt');
    }
    if (addID) {
      select.push('id');
    }
    return await this.usersRepository.findOne(user, { select });
  }
}
