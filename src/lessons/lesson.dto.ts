import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DIFFICULTIES_ENUM } from '../common/constants';
import Courses from '../courses/courses.entity';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  listOfTasks: number[];

  @IsString()
  @IsEnum(DIFFICULTIES_ENUM)
  difficulty: DIFFICULTIES_ENUM;

  @IsNumber()
  courses: Courses;
}

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  listOfTasks: number[];

  @IsString()
  @IsEnum(DIFFICULTIES_ENUM)
  @IsOptional()
  difficulty: DIFFICULTIES_ENUM;

  @IsNumber()
  @IsOptional()
  courses: Courses;
}
