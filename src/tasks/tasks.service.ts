import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import Tasks from './tasks.entity';
import CreateTaskDto from './create-task.dto';

@Injectable()
export default class TasksService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
  ) {}

  async createTask(task: CreateTaskDto): Promise<InsertResult> {
    return await this.tasksRepository.insert(task);
  }

  async updateTask(id: number, task: CreateTaskDto): Promise<UpdateResult> {
    const target = await this.findById(id);

    if (!target) {
      throw new Error('Task Not Found');
    }

    return await this.tasksRepository.update({ id }, { ...task });
  }

  async deleteTask(id: number): Promise<DeleteResult> {
    const task = await this.findById(id);

    if (!task) {
      throw new Error('Task Not Found');
    }

    return await this.tasksRepository.delete(task);
  }

  async findById(id: number): Promise<any> {
    return await this.tasksRepository.findOne(id);
  }
}
