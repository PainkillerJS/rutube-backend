import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auht.decorator';

import { CurrentUser } from './decorators/user.decorator';
import UserDto from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: UserEntity['id']) {
		return this.userService.getById(id);
	}

	@Get(':id')
	async getUser(@Param('id', ParseIntPipe) id: number) {
		return this.userService.getById(id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async updateUser(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UserDto,
	) {
		return this.userService.updateProfile(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('subscribe/:channelId')
	@Auth()
	async subscribeToChannel(
		@CurrentUser('id') id: UserEntity['id'],
		@Param('channelId', ParseIntPipe) channelId: number,
	) {
		return this.userService.subscribe(id, channelId);
	}

	@Get('getAll')
	async getUsers() {
		return this.userService.getAll();
	}
}
