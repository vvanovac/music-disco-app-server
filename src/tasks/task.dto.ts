import { ArrayNotEmpty, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { MUSIC_NOTES_ENUM, OCTAVE_ENUM } from '../common/constants';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(MUSIC_NOTES_ENUM, { each: true })
  musicNotes: MUSIC_NOTES_ENUM[];

  @IsString()
  @IsEnum(OCTAVE_ENUM)
  octave: OCTAVE_ENUM;
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
  @ArrayNotEmpty()
  @IsOptional()
  @IsEnum(MUSIC_NOTES_ENUM, { each: true })
  musicNotes: MUSIC_NOTES_ENUM[];

  @IsString()
  @IsOptional()
  @IsEnum(OCTAVE_ENUM)
  octave: OCTAVE_ENUM;
}
