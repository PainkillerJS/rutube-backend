import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import type { FindOptionsWhereProperty } from 'typeorm';
import { ILike, MoreThan, Repository } from 'typeorm';

import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepositories: Repository<VideoEntity>,
  ) {}

  async byId(id: number, isPublic = false) {
    const video = this.videoRepositories.findOne({
      where: isPublic
        ? { id, isPublic: true }
        : {
            id,
          },
      relations: {
        user: true,
        comments: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscriberCount: true,
          subscriptions: true,
        },
        comments: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscriberCount: true,
          },
        },
      },
    });

    if (!video) {
      throw new NotFoundException('Видео не найдено');
    }

    return video;
  }

  async update(id: number, dto: VideoDto) {
    const video = await this.byId(id);

    return this.videoRepositories.save({
      ...video,
      ...dto,
    });
  }

  async getAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};

    if (searchTerm) {
      options = {
        name: ILike(`%${searchTerm}%`),
      };
    }

    return this.videoRepositories.find({
      where: {
        ...options,
        isPublic: true,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
        comments: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
        },
      },
    });
  }

  async getMostPopularByViews() {
    return this.videoRepositories.find({
      where: {
        views: MoreThan(0),
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
        },
      },
      order: {
        views: -1,
      },
    });
  }

  async create(userId: number) {
    const defaultValue = {
      name: '',
      videoPath: '',
      description: '',
      thumbnailPath: '',
      user: { id: userId },
    };

    const newVideo = this.videoRepositories.create(defaultValue);
    const video = await this.videoRepositories.save(newVideo);

    return video.id;
  }

  async delete(id: number) {
    return this.videoRepositories.delete({ id });
  }

  async updateCountViews(id: number) {
    const video = await this.byId(id);

    video.views += 1;

    return this.videoRepositories.save(video);
  }

  async updateReaction(id: number) {
    const video = await this.byId(id);

    video.likes += 1;

    return this.videoRepositories.save(video);
  }
}
