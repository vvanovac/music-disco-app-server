import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './authentication/auth.module';
import constants from './common/constants';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      ...constants.database,
      keepConnectionAlive: true,
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
