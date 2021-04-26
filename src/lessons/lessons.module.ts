import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import LessonsController from './lessons.controller';
import LessonsService from './lessons.service';
import Lessons from './lessons.entity';
import { I_LESSON_SERVICE } from './lesson.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Lessons])],
  controllers: [LessonsController],
  providers: [
    {
      useClass: LessonsService,
      provide: I_LESSON_SERVICE,
    },
  ],
  exports: [TypeOrmModule, LessonsModule],
})
export class LessonsModule {}
