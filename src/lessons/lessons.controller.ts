import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

import { CreateLessonDto, UpdateLessonDto } from './lesson.dto';
import { ILesson, ILessonService } from './lesson.interface';
import { I_LESSON_SERVICE } from './lesson.constants';
import { JwtAuthGuard } from '../authentication/jwt.auth.guard';
import { AUTH_GUARD_TYPES_ENUM } from '../common/constants';

@UseGuards(JwtAuthGuard)
@Controller('lessons')
export default class LessonsController {
  constructor(
    @Inject(I_LESSON_SERVICE)
    private readonly lessonsService: ILessonService,
  ) {}

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Post()
  async create(@Body() createLessonDto: CreateLessonDto, @Res() res): Promise<ILesson> {
    try {
      const lesson = await this.lessonsService.createLesson(createLessonDto);
      return res.status(HttpStatus.CREATED).json(lesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async find(@Res() res): Promise<ILesson[]> {
    try {
      const lessons = await this.lessonsService.findLessons();
      return res.status(HttpStatus.OK).json(lessons);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id, @Res() res): Promise<ILesson> {
    try {
      const lesson = await this.lessonsService.findLesson(id);
      return res.status(HttpStatus.OK).json(lesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/byCourse/:courseID')
  async findByCourse(@Param('courseID') courseID, @Res() res): Promise<ILesson[]> {
    try {
      const lessons = await this.lessonsService.findLessonsByCourseID(courseID);
      return res.status(HttpStatus.OK).json(lessons);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Put(':id')
  async update(@Param('id') id, @Body() updateLessonDto: UpdateLessonDto, @Res() res): Promise<ILesson> {
    try {
      const lesson = await this.lessonsService.updateLesson(id, updateLessonDto);
      return res.status(HttpStatus.OK).json(lesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Delete(':id')
  async delete(@Param('id') id, @Res() res): Promise<ILesson> {
    try {
      const lesson = await this.lessonsService.deleteLesson(id);
      return res.status(HttpStatus.OK).json(lesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
