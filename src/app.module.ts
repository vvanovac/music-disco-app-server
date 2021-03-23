import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthModule from './authentication/auth.module';
import Users from './authentication/users.entity';
import { database } from './common/constants';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      ...database,
      keepConnectionAlive: true,
      entities: [Users],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
