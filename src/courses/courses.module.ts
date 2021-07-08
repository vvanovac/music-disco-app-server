import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CoursesController from './courses.controller';
import CoursesService from './courses.service';
import Courses from './courses.entity';
import { I_COURSE_SERVICE } from './courses.constants';

@Module({
  imports: [TypeOrmModule.forFeature([Courses])],
  controllers: [CoursesController],
  providers: [
    {
      useClass: CoursesService,
      provide: I_COURSE_SERVICE,
    },
  ],
  exports: [TypeOrmModule, CoursesModule],
})
export class CoursesModule {}
