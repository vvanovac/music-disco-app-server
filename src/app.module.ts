import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthModule from './authentication/auth.module';
import Users from './authentication/users.entity';
import { TasksModule } from './tasks/tasks.module';
import Tasks from './tasks/tasks.entity';
import { database } from './common/constants';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    TypeOrmModule.forRoot({
      ...database,
      keepConnectionAlive: true,
      entities: [Users, Tasks],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
