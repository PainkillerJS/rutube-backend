import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auht.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

import { VideoDto } from './dto/video.dto';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('getPrivate/:id')
  @Auth()
  async getVideoPrivate(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.byId(id);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.videoService.getAll(searchTerm);
  }

  @Get('mostPopular')
  async getMostPopularByViews() {
    return this.videoService.getMostPopularByViews();
  }

  @Get(':id')
  async getVideo(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.byId(id);
  }

  @HttpCode(200)
  @Post()
  @Auth()
  async createVideo(@CurrentUser('id') id: number) {
    return this.videoService.create(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async updateVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VideoDto,
  ) {
    return this.videoService.update(id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.delete(id);
  }

  @HttpCode(200)
  @Put('updateViews/:videoId')
  async updateViews(@Param('videoId', ParseIntPipe) videoId: number) {
    return this.videoService.updateCountViews(videoId);
  }

  @HttpCode(200)
  @Put('updateLikes/:videoId')
  @Auth()
  async updateLikes(@Param('videoId', ParseIntPipe) videoId: number) {
    return this.videoService.updateReaction(videoId);
  }
}
