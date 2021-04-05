import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import TasksController from './tasks.controller';
import TasksService from './tasks.service';
import Tasks from './tasks.entity';
import { I_TASK_SERVICE } from './task.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks])],
  controllers: [TasksController],
  providers: [
    {
      useClass: TasksService,
      provide: I_TASK_SERVICE,
    },
  ],
  exports: [TypeOrmModule, TasksModule],
})
export class TasksModule {}
