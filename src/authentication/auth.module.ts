import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import constants from '../common/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: constants.jwt.secret,
      signOptions: { expiresIn: constants.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthModule, JwtModule],
})
export default class AuthModule {}
