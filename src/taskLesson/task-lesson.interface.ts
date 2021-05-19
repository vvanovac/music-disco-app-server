import { DIFFICULTIES_ENUM } from '../common/constants';
import { UpdateTaskLessonDto } from './task-lesson.dto';
import Lessons from '../lessons/lessons.entity';
import Tasks from '../tasks/tasks.entity';

export interface ITaskLesson {
  readonly id?: number;
  readonly lessons: Lessons;
  readonly tasks: Tasks;
  readonly difficulty: DIFFICULTIES_ENUM;
  readonly taskOrder: number;
}

export interface ITaskLessonService {
  createTaskLesson(taskLesson: ITaskLesson): Promise<ITaskLesson>;
  findTaskLessons(): Promise<ITaskLesson[]>;
  findTaskLesson(id: number): Promise<ITaskLesson>;
  updateTaskLesson(id: number, taskLesson: UpdateTaskLessonDto): Promise<ITaskLesson>;
  deleteTaskLesson(id: number): Promise<ITaskLesson>;
}
