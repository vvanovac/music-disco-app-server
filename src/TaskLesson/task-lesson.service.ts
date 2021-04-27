import { Injectable } from '@nestjs/common';
import { ITaskLesson, ITaskLessonService } from './task-lesson.interface';
import { InjectRepository } from '@nestjs/typeorm';

import TaskLesson from './task-lesson.entity';
import { Repository } from 'typeorm';
import { UpdateTaskLessonDto } from './task-lesson.dto';

@Injectable()
export default class TaskLessonService implements ITaskLessonService {
  constructor(
    @InjectRepository(TaskLesson)
    private taskLessonRepository: Repository<TaskLesson>,
  ) {}

  async createTaskLesson(taskLesson: ITaskLesson): Promise<ITaskLesson> {
    const inserted = await this.taskLessonRepository.insert(taskLesson);

    return this.findTaskLesson(inserted.raw[0].id);
  }

  async findTaskLessons(): Promise<ITaskLesson[]> {
    return await this.taskLessonRepository.find({ order: { id: 'ASC' } });
  }

  async findTaskLesson(id: number): Promise<ITaskLesson> {
    return (await this.taskLessonRepository.findOne(id)) || null;
  }

  async updateTaskLesson(id: number, taskLesson: UpdateTaskLessonDto): Promise<ITaskLesson> {
    const target = await this.findTaskLesson(id);

    if (!target) {
      throw new Error('Not Found');
    }

    if (Object.keys(taskLesson).length > 0) {
      await this.taskLessonRepository.update({ id }, { ...taskLesson });
    }

    return this.findTaskLesson(id);
  }
}
