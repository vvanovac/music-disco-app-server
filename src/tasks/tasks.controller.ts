import {
  Body,
  Param,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import TasksService from './tasks.service';
import CreateTaskDto from './create-task.dto';
import UpdateTaskDto from './update-task.dto';

@Controller('tasks')
export default class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Res() res,
  ): Promise<CreateTaskDto> {
    try {
      const task = await this.tasksService.createTask(createTaskDto);
      return res.status(HttpStatus.CREATED).json(task);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Put(':id')
  async update(
    @Param() params,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res,
  ): Promise<CreateTaskDto> {
    try {
      const task = await this.tasksService.updateTask(params.id, updateTaskDto);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  async delete(@Param() params, @Res() res): Promise<CreateTaskDto> {
    try {
      const task = await this.tasksService.deleteTask(params.id);
      return res.status(HttpStatus.OK).json(task);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
