import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from '../comment/entities/comment.entity';
import { VideoEntity } from '../video/entities/video.entity';

import { SubscriptionsEntity } from './entities/subscriptions.entity';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VideoEntity,
      CommentEntity,
      SubscriptionsEntity,
      UserEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
