import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';

import Users from '../authentication/users.entity';
import TaskLesson from '../taskLesson/task-lesson.entity';

export class CreateUserProgressDto {
  @IsNumber()
  users: Users;

  @IsNumber()
  taskLesson: TaskLesson;

  @IsBoolean()
  completed: boolean;

  @IsDate()
  @IsOptional()
  completionDate: Date;
}

export class UpdateUserProgressDto {
  @IsNumber()
  @IsOptional()
  users: Users;

  @IsNumber()
  @IsOptional()
  taskLesson: TaskLesson;

  @IsBoolean()
  @IsOptional()
  completed: boolean;

  @IsDate()
  @IsOptional()
  completionDate: Date;
}
