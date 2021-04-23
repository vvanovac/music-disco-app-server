import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Lessons from './lessons.entity';
import { ILesson } from './lesson.interface';

@Injectable()
export default class LessonsService {
  constructor(
    @InjectRepository(Lessons)
    private lessonsRepository: Repository<Lessons>,
  ) {}

  async findLessons(): Promise<ILesson[]> {
    return await this.lessonsRepository.find();
  }
}
