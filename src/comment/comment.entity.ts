import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/utils/base.entity';
import { UserEntity } from '../user/entities/user.entity';
import { VideoEntity } from '../video/video.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
	@Column()
	message: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	userId: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.comments)
	@JoinColumn({ name: 'video_id' })
	videoId: VideoEntity;
}
