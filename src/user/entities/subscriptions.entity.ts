import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/utils/base.entity';

import { UserEntity } from './user.entity';

@Entity('subscriptions')
export class SubscriptionsEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: 'from_user' })
  fromUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.subscribers)
  @JoinColumn({ name: 'to_channel' })
  toChannel: UserEntity;
}
