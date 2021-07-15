import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';

import Courses from './courses.entity';
import { UpdateCourseDto } from './courses.dto';
import { ICourse, ICourseService } from './courses.interface';
import Lessons from '../lessons/lessons.entity';

@Injectable()
export default class CoursesService implements ICourseService {
  constructor(
    @InjectRepository(Courses)
    private coursesRepository: Repository<Courses>,
  ) {}

  async createCourse(course: ICourse): Promise<ICourse> {
    const inserted = await this.coursesRepository.insert(course);

    return this.findCourse(inserted.raw[0].id);
  }

  async findCourses(): Promise<ICourse[]> {
    return await this.coursesRepository.find({ order: { id: 'ASC' } });
  }

  async findCourse(id: number): Promise<ICourse> {
    return (await this.coursesRepository.findOne(id)) || null;
  }

  async countLessons(id: number): Promise<number> {
    return await createQueryBuilder()
      .select('lessons')
      .from(Lessons, 'lessons')
      .innerJoin(Courses, 'courses', 'courses.id = lessons.coursesId')
      .where('lessons.coursesId = :id', { id })
      .getCount();
  }

  async updateCourse(id: number, course: UpdateCourseDto): Promise<ICourse> {
    const target = await this.findCourse(id);

    if (!target) {
      throw new Error('Course Not Found');
    }

    if (Object.keys(course).length > 0) {
      await this.coursesRepository.update({ id }, { ...course });
    }

    return this.findCourse(id);
  }

  async deleteCourse(id: number): Promise<ICourse> {
    const course = await this.findCourse(id);

    if (!course) {
      throw new Error('Course Not Found');
    }
    await this.coursesRepository.delete({ id: course.id });

    return course;
  }
}
