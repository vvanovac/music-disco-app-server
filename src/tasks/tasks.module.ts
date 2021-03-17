import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import TasksController from './tasks.controller';
import TasksService from './tasks.service';
import Tasks from './tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tasks])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TypeOrmModule, TasksModule],
})
export class TasksModule {}
