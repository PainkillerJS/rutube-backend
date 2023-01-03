import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { Auth } from '../auth/decorators/auht.decorator';
import { CurrentUser } from '../user/decorators/user.decorator';

import { CommentDto } from './dto/comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async createComment(@CurrentUser('id') id: number, @Body() dto: CommentDto) {
    return this.commentService.create(id, dto);
  }
}
