import { compare, genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	private getUserFields({ id, email }: UserEntity) {
		return {
			id,
			email,
		};
	}

	private async validateUser({ email, password }: AuthDto) {
		const user = await this.userRepository.findOne({
			where: {
				email,
			},
			select: ['id', 'email', 'password'],
		});

		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		const isValidPassword = await compare(password, user.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Неправильный пароль');
		}

		return user;
	}

	async createAccessToken(userId: UserEntity['id']) {
		const data = { id: userId };

		return this.jwtService.signAsync(data, {
			expiresIn: '30d',
		});
	}

	async register({ email, password }: AuthDto) {
		await this.userService.isCheckUserByEmail(email);

		const salt = await genSalt(10);

		const newUser = await this.userRepository.create({
			email,
			password: await hash(password, salt),
		});

		const [user, accessToken] = await Promise.allSettled([
			this.userRepository.save(newUser),
			this.createAccessToken(newUser.id),
		]);

		if (user.status === 'rejected' || accessToken.status === 'rejected') {
			throw new BadRequestException('Ошибка в создании нового пользователя');
		}

		return {
			user: this.getUserFields(user.value),
			accessToken: accessToken.value,
		};
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);

		return {
			user: this.getUserFields(user),
			accessToken: await this.createAccessToken(user.id),
		};
	}
}
