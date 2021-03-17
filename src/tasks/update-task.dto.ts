import { IsInt, IsString, IsOptional } from 'class-validator';

export default class UpdateTaskDto {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  subtitle: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  descriptionImage: string;
}
