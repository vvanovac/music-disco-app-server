import { DIFFICULTIES_ENUM } from '../common/constants';
import { UpdateLessonDto } from './lesson.dto';
import Courses from '../courses/courses.entity';

export interface ILesson {
  readonly id?: number;
  readonly title: string;
  readonly description: string;
  readonly listOfTasks: number[];
  readonly difficulty: DIFFICULTIES_ENUM;
  readonly courses: Courses;
}

export interface ILessonService {
  createLesson(lesson: ILesson): Promise<ILesson>;
  findLessons(): Promise<ILesson[]>;
  findLesson(id: number): Promise<ILesson>;
  findLessonsByCourseID(courseID: number): Promise<ILesson[]>;
  updateLesson(id: number, lesson: UpdateLessonDto): Promise<ILesson>;
  deleteLesson(id: number): Promise<ILesson>;
}
