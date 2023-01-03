import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  videoPath: string;

  @IsString()
  thumbnailPath: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
