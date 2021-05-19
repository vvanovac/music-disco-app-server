import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

import { CreateTaskLessonDto, UpdateTaskLessonDto } from './task-lesson.dto';
import { ITaskLesson, ITaskLessonService } from './task-lesson.interface';
import { I_TASK_LESSON_SERVICE } from './task-lesson.constants';
import { JwtAuthGuard } from '../authentication/jwt.auth.guard';
import { AUTH_GUARD_TYPES_ENUM } from '../common/constants';

@UseGuards(JwtAuthGuard)
@Controller('taskLesson')
export default class TaskLessonController {
  constructor(
    @Inject(I_TASK_LESSON_SERVICE)
    private readonly taskLessonService: ITaskLessonService,
  ) {}

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Post()
  async create(@Body() createTaskLessonDto: CreateTaskLessonDto, @Res() res): Promise<ITaskLesson> {
    try {
      const taskLesson = await this.taskLessonService.createTaskLesson(createTaskLessonDto);
      return res.status(HttpStatus.CREATED).json(taskLesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async find(@Res() res): Promise<ITaskLesson[]> {
    try {
      const taskLessons = await this.taskLessonService.findTaskLessons();
      return res.status(HttpStatus.OK).json(taskLessons);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id, @Res() res): Promise<ITaskLesson> {
    try {
      const taskLesson = await this.taskLessonService.findTaskLesson(id);
      return res.status(HttpStatus.OK).json(taskLesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Put(':id')
  async update(@Param('id') id, @Body() updateTaskLessonDto: UpdateTaskLessonDto, @Res() res): Promise<ITaskLesson> {
    try {
      const taskLesson = await this.taskLessonService.updateTaskLesson(id, updateTaskLessonDto);
      return res.status(HttpStatus.OK).json(taskLesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Delete(':id')
  async delete(@Param('id') id, @Res() res): Promise<ITaskLesson> {
    try {
      const taskLesson = await this.taskLessonService.deleteTaskLesson(id);
      return res.status(HttpStatus.OK).json(taskLesson);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
