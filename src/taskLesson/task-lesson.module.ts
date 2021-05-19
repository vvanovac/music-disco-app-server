import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import TaskLesson from './task-lesson.entity';
import TaskLessonService from './task-lesson.service';
import { I_TASK_LESSON_SERVICE } from './task-lesson.constants';
import TaskLessonController from './task-lesson.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLesson])],
  controllers: [TaskLessonController],
  providers: [
    {
      useClass: TaskLessonService,
      provide: I_TASK_LESSON_SERVICE,
    },
  ],
  exports: [TypeOrmModule, TaskLessonModule],
})
export class TaskLessonModule {}
