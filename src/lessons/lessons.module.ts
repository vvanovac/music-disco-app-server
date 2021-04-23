import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import LessonsController from './lessons.controller';
import LessonsService from './lessons.service';
import Lessons from './lessons.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lessons])],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [TypeOrmModule, LessonsModule],
})
export class LessonsModule {}
