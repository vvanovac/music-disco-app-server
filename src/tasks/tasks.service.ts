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

  async createTask(task: CreateTaskDto): Promise<ITask> {
    const inserted = await this.tasksRepository.insert(task);

    return this.findTask(inserted.raw[0].id);
  }

  async findTasks(): Promise<ITask[]> {
    return await this.tasksRepository.find();
  }

  async findTask(id: number): Promise<ITask> {
    return (await this.tasksRepository.findOne(id)) || null;
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<ITask> {
    const target = await this.findTask(id);

    if (!target) {
      throw new Error('Task Not Found');
    }

    await this.tasksRepository.update({ id }, { ...task });

    return this.findTask(id);
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
