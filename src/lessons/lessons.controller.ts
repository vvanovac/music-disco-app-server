import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';

import LessonsService from './lessons.service';
import { ILesson } from './lesson.interface';

@Controller('lessons')
export default class LessonsController {
  constructor(
    @Inject(LessonsService)
    private readonly lessonsService: LessonsService,
  ) {}

  @Get()
  async find(@Res() res): Promise<ILesson[]> {
    try {
      const lessons = await this.lessonsService.findLessons();
      return res.status(HttpStatus.OK).json(lessons);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
