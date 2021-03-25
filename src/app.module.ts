import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthModule from './authentication/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { database } from './common/constants';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    TypeOrmModule.forRoot({
      ...database,
      keepConnectionAlive: true,
    }),
  ],
})
export class AppModule {}
