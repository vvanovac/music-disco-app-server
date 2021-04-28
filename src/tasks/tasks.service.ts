import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import Tasks from './tasks.entity';
import { UpdateTaskDto } from './task.dto';
import { ITask, ITaskService } from './task.interface';
import TaskLesson from '../TaskLesson/task-lesson.entity';

@Injectable()
export default class TasksService implements ITaskService {
  constructor(
    @InjectRepository(Tasks)
    private tasksRepository: Repository<Tasks>,
  ) {}

  async createTask(task: ITask): Promise<ITask> {
    const inserted = await this.tasksRepository.insert(task);

    return this.findTask(inserted.raw[0].id);
  }

  async findTasks(): Promise<ITask[]> {
    return await this.tasksRepository.find({ order: { id: 'ASC' } });
  }

  async findTask(id: number): Promise<ITask> {
    return (await this.tasksRepository.findOne(id)) || null;
  }

  async findTaskByLessonID(lessonID: number): Promise<ITask[]> {
    return await createQueryBuilder()
      .select('tasks')
      .from(Tasks, 'tasks')
      .innerJoin(TaskLesson, 'taskLesson', 'tasks.id = taskLesson.tasksId')
      .where('taskLesson.lessonsId = :lessonID', { lessonID: lessonID })
      .orderBy('tasks.id', 'ASC')
      .getMany();
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<ITask> {
    const target = await this.findTask(id);

    if (!target) {
      throw new Error('Task Not Found');
    }

    if (Object.keys(task).length > 0) {
      await this.tasksRepository.update({ id }, { ...task });
    }

    return this.findTask(id);
  }

  async deleteTask(id: number): Promise<ITask> {
    const task = await this.findTask(id);

    if (!task) {
      throw new Error('Task Not Found');
    }
    await this.tasksRepository.delete({ id: task.id });

    return task;
  }
}
