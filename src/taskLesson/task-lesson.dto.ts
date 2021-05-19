import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DIFFICULTIES_ENUM } from '../common/constants';
import Lessons from '../lessons/lessons.entity';
import Tasks from '../tasks/tasks.entity';

export class CreateTaskLessonDto {
  @IsNumber()
  lessons: Lessons;

  @IsNumber()
  tasks: Tasks;

  @IsString()
  @IsEnum(DIFFICULTIES_ENUM)
  difficulty: DIFFICULTIES_ENUM;

  @IsNumber()
  taskOrder: number;
}

export class UpdateTaskLessonDto {
  @IsNumber()
  @IsOptional()
  lessons: Lessons;

  @IsNumber()
  @IsOptional()
  tasks: Tasks;

  @IsString()
  @IsOptional()
  @IsEnum(DIFFICULTIES_ENUM)
  difficulty: DIFFICULTIES_ENUM;

  @IsNumber()
  @IsOptional()
  taskOrder: number;
}
