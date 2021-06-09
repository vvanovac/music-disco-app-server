import Users from '../authentication/users.entity';
import TaskLesson from '../taskLesson/task-lesson.entity';
import { UpdateUserProgressDto } from './user-progress.dto';

export interface IUserProgress {
  readonly id?: number;
  readonly users: Users;
  readonly taskLesson: TaskLesson;
  readonly completed: boolean;
  readonly completionDate?: Date;
}

export interface ITaskProgress {
  readonly taskID: number;
  readonly completed: boolean;
}

export interface IUserProgressService {
  createUserProgress(userProgress: IUserProgress): Promise<IUserProgress>;
  findAllUserProgress(): Promise<IUserProgress[]>;
  findOneUserProgress(id: number): Promise<IUserProgress>;
  getUserProgressID(userID: number, lessonID: number, taskID: number): Promise<number>;
  getTaskProgress(userID: number, lessonID: number): Promise<ITaskProgress[]>;
  countCompletedTasks(userID: number, lessonID: number): Promise<number>;
  updateUserProgress(id: number, userProgress: UpdateUserProgressDto): Promise<IUserProgress>;
}
