import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/utils/base.entity';
import { VideoEntity } from '../../video/video.entity';

import { SubscriptionsEntity } from './subscriptions.entity';

@Entity('user')
export class UserEntity extends BaseEntity {
	@Column({ unique: true })
	email: string;

	@Column({ select: false })
	password: string;

	@Column({ default: false })
	name: string;

	@Column({ default: false, name: 'is_verified' })
	isVerified: boolean;

	@Column({ default: 0, name: 'subscriber_count' })
	subscriberCount?: number;

	@Column({ default: '', type: 'text' })
	description: string;

	@Column({ default: '', name: 'avatar_path' })
	avatarPath: string;

	@OneToMany(() => VideoEntity, (video) => video.userId)
	videos: VideoEntity[];

	@OneToMany(() => SubscriptionsEntity, (subscription) => subscription.fromUser)
	subscriptions: SubscriptionsEntity[];

	@OneToMany(
		() => SubscriptionsEntity,
		(subscription) => subscription.toChannel,
	)
	subscribers: SubscriptionsEntity[];
}
