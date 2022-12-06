import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { CommentEntity } from '../comment/comment.entity';
import { BaseEntity } from '../common/utils/base.entity';
import { UserEntity } from '../user/entities/user.entity';

@Entity('video')
export class VideoEntity extends BaseEntity {
	@Column()
	name: string;

	@Column({ default: true, name: 'is_public' })
	isPublic: boolean;

	@Column({ default: 0 })
	views: number;

	@Column({ default: 0 })
	likes: number;

	@Column({ default: 0 })
	duration: number;

	@Column({ default: '', type: 'text' })
	description: string;

	@OneToMany(() => UserEntity, (user) => user.videos)
	@JoinColumn({ name: 'user_id' })
	userId: UserEntity;

	@OneToMany(() => CommentEntity, (comment) => comment.videoId)
	comments: CommentEntity[];
}
