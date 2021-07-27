import { UpdateCourseDto } from './courses.dto';
import { INSTRUMENT_ENUM } from '../common/constants';

export interface ICourse {
  readonly id?: number;
  readonly title: string;
  readonly description: string;
  readonly instrument: INSTRUMENT_ENUM;
}

export interface ICourseService {
  createCourse(course: ICourse): Promise<ICourse>;
  findCourses(): Promise<ICourse[]>;
  findCourse(id: number): Promise<ICourse>;
  countLessons(id: number): Promise<number>;
  updateCourse(id: number, course: UpdateCourseDto): Promise<ICourse>;
  deleteCourse(id: number): Promise<ICourse>;
}
