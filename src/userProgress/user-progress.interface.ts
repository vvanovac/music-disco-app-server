import Users from '../authentication/users.entity';
import TaskLesson from '../taskLesson/task-lesson.entity';
import { UpdateUserProgressDto } from './user-progress.dto';

export interface IUserProgress {
  readonly id?: number;
  readonly users: Users;
  readonly taskLesson: TaskLesson;
  readonly completed: boolean;
  readonly completionDate: Date;
}

export interface IUserProgressService {
  createUserProgress(userProgress: IUserProgress): Promise<IUserProgress>;
  findAllUserProgress(): Promise<IUserProgress[]>;
  findOneUserProgress(id: number): Promise<IUserProgress>;
  updateUserProgress(id: number, userProgress: UpdateUserProgressDto): Promise<IUserProgress>;
}
