import { UpdateTaskDto } from './task.dto';

export interface ITask {
  readonly id?: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly musicNotes: string[];
}

export interface ITaskService {
  createTask(task: ITask): Promise<ITask>;
  findTasks(): Promise<ITask[]>;
  findTask(id: number): Promise<ITask>;
  updateTask(id: number, task: UpdateTaskDto): Promise<ITask>;
  deleteTask(id: number): Promise<ITask>;
}
