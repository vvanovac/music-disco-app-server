import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  description: string;

  @IsUrl()
  @IsOptional()
  imageURL: string;
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

  @IsUrl()
  @IsOptional()
  imageURL: string;
}
