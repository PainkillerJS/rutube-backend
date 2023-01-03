import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { genSalt, hash } from 'bcryptjs';
import { Repository } from 'typeorm';

import UserDto from './dto/user.dto';
import { SubscriptionsEntity } from './entities/subscriptions.entity';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionsEntity)
    private readonly subscriptionRepository: Repository<SubscriptionsEntity>,
  ) {}

  async isCheckUserByEmail(
    email: UserEntity['email'],
  ): Promise<true | BadRequestException> {
    const oldUser = await this.userRepository.findOneBy({
      email,
    });

    if (oldUser) {
      return new BadRequestException('Email Занят');
    }

    return true;
  }

  async getById(id: UserEntity['id']): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { videos: true, subscriptions: { toChannel: true } },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!user) {
      throw new NotFoundException('Юзер не найден');
    }

    return user;
  }

  async updateProfile(
    id: UserEntity['id'],
    { email, password, ...otherDataUser }: UserDto,
  ) {
    const [userResponse] = await Promise.allSettled([
      this.getById(id),
      this.isCheckUserByEmail(email),
    ]);

    if (userResponse.status === 'fulfilled') {
      const userFounded = userResponse.value;

      if (password) {
        const salt = await genSalt(10);
        userFounded.password = await hash(password, salt);
      }

      const user = Object.assign(userFounded, { email, ...otherDataUser });

      return this.userRepository.save(user);
    }

    throw new BadRequestException('Ошибка запроса userRepositories');
  }

  async subscribe(
    id: UserEntity['id'],
    idChannel: SubscriptionsEntity['toChannel']['id'],
  ): Promise<boolean> {
    const objectSubscribe = {
      toChannel: { id: idChannel },
      fromUser: { id },
    };

    const isSubscribed = await this.subscriptionRepository.findOneBy(
      objectSubscribe,
    );

    if (!isSubscribed) {
      const newSubscription =
        this.subscriptionRepository.create(objectSubscribe);

      await this.subscriptionRepository.save(newSubscription);

      return true;
    }

    await this.subscriptionRepository.delete(objectSubscribe);

    return false;
  }

  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }
}
