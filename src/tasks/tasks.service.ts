import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Tasks from './tasks.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import ITask from './task.interface';

@Injectable()
export default class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
  ) {}

  async createTask(task: CreateTaskDto): Promise<CreateTaskDto> {
    await this.tasksRepository.insert(task);

    return task;
  }

  async findTasks(): Promise<ITask[]> {
    return await this.tasksRepository.find();
  }

  async findTask(id: number): Promise<ITask> {
    return (await this.tasksRepository.findOne(id)) || null;
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<UpdateTaskDto> {
    const target = await this.findTask(id);

    if (!target) {
      throw new Error('Task Not Found');
    }

    await this.tasksRepository.update({ id }, { ...task });

    return task;
  }

  async deleteTask(id: number): Promise<ITask> {
    const task = await this.findTask(id);

    if (!task) {
      throw new Error('Task Not Found');
    }

    await this.tasksRepository.delete(task);

    return task;
  }
}
