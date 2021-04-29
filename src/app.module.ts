import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AuthModule from './authentication/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { LessonsModule } from './lessons/lessons.module';
import { UserProgressModule } from './userProgress/user-progress.module';
import { database } from './common/constants';

@Module({
  imports: [
    AuthModule,
    TasksModule,
    LessonsModule,
    UserProgressModule,
    TypeOrmModule.forRoot({
      ...database,
      keepConnectionAlive: true,
    }),
  ],
})
export class AppModule {}
