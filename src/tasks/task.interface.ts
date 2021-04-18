import { UpdateTaskDto } from './task.dto';
import { MUSIC_NOTES_ENUM, OCTAVE_ENUM } from '../common/constants';

export interface ITask {
  readonly id?: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly musicNotes: MUSIC_NOTES_ENUM[];
  readonly octave: OCTAVE_ENUM;
}

export interface ITaskService {
  createTask(task: ITask): Promise<ITask>;
  findTasks(): Promise<ITask[]>;
  findTask(id: number): Promise<ITask>;
  updateTask(id: number, task: UpdateTaskDto): Promise<ITask>;
  deleteTask(id: number): Promise<ITask>;
}
