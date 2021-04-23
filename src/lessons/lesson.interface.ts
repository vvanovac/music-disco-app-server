import { DIFFICULTIES_ENUM } from '../common/constants';

export interface ILesson {
  readonly id?: number;
  readonly title: string;
  readonly description: string;
  readonly listOfTasks: number[];
  readonly difficulty: DIFFICULTIES_ENUM;
  readonly courseID: number;
}
