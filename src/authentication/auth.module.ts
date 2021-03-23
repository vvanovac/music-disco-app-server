import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import Users from './users.entity';
import { jwt } from '../common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    JwtModule.register({
      secret: jwt.secret,
      signOptions: { expiresIn: jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [TypeOrmModule, AuthModule, JwtModule],
})
export default class AuthModule {}
