import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Lessons from './lessons.entity';
import { UpdateLessonDto } from './lesson.dto';
import { ILesson, ILessonService } from './lesson.interface';

@Injectable()
export default class LessonsService implements ILessonService {
  constructor(
    @InjectRepository(Lessons)
    private lessonsRepository: Repository<Lessons>,
  ) {}

  async createLesson(lesson: ILesson): Promise<ILesson> {
    const inserted = await this.lessonsRepository.insert(lesson);

    return this.findLesson(inserted.raw[0].id);
  }

  async findLessons(): Promise<ILesson[]> {
    return await this.lessonsRepository.find({ order: { id: 'ASC' } });
  }

  async findLesson(id: number): Promise<ILesson> {
    return (await this.lessonsRepository.findOne(id)) || null;
  }

  async updateLesson(id: number, lesson: UpdateLessonDto): Promise<ILesson> {
    const target = await this.findLesson(id);

    if (!target) {
      throw new Error('Lesson Not Found');
    }

    if (Object.keys(lesson).length > 0) {
      await this.lessonsRepository.update({ id }, { ...lesson });
    }

    return this.findLesson(id);
  }

  async deleteLesson(id: number): Promise<ILesson> {
    const lesson = await this.findLesson(id);

    if (!lesson) {
      throw new Error('Lesson Not Found');
    }
    await this.lessonsRepository.delete({ id: lesson.id });

    return lesson;
  }
}