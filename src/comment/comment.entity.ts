import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/utils/base.entity';
import { UserEntity } from '../user/entities/user.entity';
import { VideoEntity } from '../video/entities/video.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @Column()
  message: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => VideoEntity, (video) => video.comments)
  @JoinColumn({ name: 'video' })
  video: VideoEntity;
}
