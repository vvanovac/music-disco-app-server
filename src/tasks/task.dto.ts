import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsArray()
  musicNotes: string[];
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  subtitle: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  musicNotes: string[];
}
