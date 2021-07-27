import { IsEnum, IsOptional, IsString } from 'class-validator';
import { INSTRUMENT_ENUM } from '../common/constants';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(INSTRUMENT_ENUM)
  instrument: INSTRUMENT_ENUM;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum(INSTRUMENT_ENUM)
  instrument: INSTRUMENT_ENUM;
}
