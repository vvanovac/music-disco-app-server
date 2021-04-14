import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { MUSIC_NOTES_ENUM } from '../common/constants';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsArray()
  @IsEnum(MUSIC_NOTES_ENUM, { each: true })
  musicNotes: MUSIC_NOTES_ENUM[];
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
  @IsEnum(MUSIC_NOTES_ENUM, { each: true })
  musicNotes: MUSIC_NOTES_ENUM[];
}
