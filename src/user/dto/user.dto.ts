import { IsEmail, IsString } from 'class-validator';

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
	password?: string;
}

export default UserDto;
