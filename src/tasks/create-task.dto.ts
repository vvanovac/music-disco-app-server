import { IsInt, IsString } from 'class-validator';

export default class CreateTaskDto {
  @IsInt()
  id: number;

  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsString()
  descriptionImage: string;
}
