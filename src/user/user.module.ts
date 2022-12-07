import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from '../comment/comment.entity';
import { VideoEntity } from '../video/video.entity';

import { SubscriptionsEntity } from './entities/subscriptions.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([VideoEntity, CommentEntity, SubscriptionsEntity]),
	],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
