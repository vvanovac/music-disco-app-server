import { Body, Param, Controller, HttpStatus, Post, Get, Put, Delete, Res, UseGuards, Inject } from '@nestjs/common';

import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { ITask, ITaskService } from './task.interface';
import { JwtAuthGuard } from '../authentication/jwt.auth.guard';
import { AUTH_GUARD_TYPES_ENUM } from '../common/constants';
import { I_TASK_SERVICE } from './task.constants';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export default class TasksController {
  constructor(
    @Inject(I_TASK_SERVICE)
    private readonly tasksService: ITaskService,
  ) {}

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.createTask(createTaskDto);
      return res.status(HttpStatus.CREATED).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async find(@Res() res): Promise<ITask[]> {
    try {
      const tasks = await this.tasksService.findTasks();
      return res.status(HttpStatus.OK).json(tasks);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.findTask(id);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/byLesson/:lessonID')
  async findByLesson(@Param('lessonID') lessonID, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.findTaskByLessonID(lessonID);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Put(':id')
  async update(@Param('id') id, @Body() updateTaskDto: UpdateTaskDto, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.updateTask(id, updateTaskDto);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Delete(':id')
  async delete(@Param('id') id, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.deleteTask(id);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
