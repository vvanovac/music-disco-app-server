import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import TaskLesson from './task-lesson.entity';
import { UpdateTaskLessonDto } from './task-lesson.dto';
import { ITaskLesson, ITaskLessonService } from './task-lesson.interface';

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

  async deleteTaskLesson(id: number): Promise<ITaskLesson> {
    const taskLesson = await this.findTaskLesson(id);

    if (!taskLesson) {
      throw new Error('TaskLesson Not Found');
    }
    await this.taskLessonRepository.delete({ id: taskLesson.id });

    return taskLesson;
  }
}
