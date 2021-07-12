import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';

import Lessons from './lessons.entity';
import Courses from '../courses/courses.entity';
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

  async getCourseID(lessonID: number): Promise<number> {
    const course = await createQueryBuilder()
      .select('courses')
      .from(Courses, 'courses')
      .innerJoin(Lessons, 'lessons', 'courses.id = lessons.coursesId')
      .where('lessons.id = :lessonID', { lessonID })
      .getOne();

    return course ? course.id : null;
  }

  async findLessonsByCourseID(courseID: number): Promise<ILesson[]> {
    return await createQueryBuilder()
      .select('lessons')
      .from(Lessons, 'lessons')
      .innerJoin(Courses, 'courses', 'courses.id = lessons.coursesId')
      .where('lessons.coursesId = :courseID', { courseID })
      .orderBy('lessons.id', 'ASC')
      .getMany();
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
