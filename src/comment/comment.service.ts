import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepositories: Repository<CommentEntity>,
  ) {}

  async create(userId: number, { message, videoId }: CommentDto) {
    const newComment = this.commentRepositories.create({
      message,
      video: { id: videoId },
      user: { id: userId },
    });

    return this.commentRepositories.save(newComment);
  }
}
