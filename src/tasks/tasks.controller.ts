import { Body, Param, Controller, HttpStatus, Post, Get, Put, Delete, Res } from '@nestjs/common';

import TasksService from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import ITask from './task.interface';

@Controller('tasks')
export default class TasksController {
  constructor(private tasksService: TasksService) {}

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

  @Put(':id')
  async update(@Param('id') id, @Body() updateTaskDto: UpdateTaskDto, @Res() res): Promise<ITask> {
    try {
      const task = await this.tasksService.updateTask(id, updateTaskDto);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

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
