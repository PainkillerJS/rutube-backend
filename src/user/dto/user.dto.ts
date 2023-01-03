import { IsEmail, IsOptional, IsString } from 'class-validator';

class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  avatarPath: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export default UserDto;
