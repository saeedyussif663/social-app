import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { OwnershipGuard } from 'src/guards/ownership.guard';
import { createPostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createPost(@Req() req: Request, @Body() body: createPostDto) {
    if (req.user?.sub) {
      return this.postsService.createPost(body, req?.user.sub);
    }
  }

  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param() param: { id: number }) {
    return this.postsService.getPost(param.id);
  }

  @UseGuards(AuthGuard, OwnershipGuard)
  @Patch(':id')
  updatePost(@Body() body: createPostDto, @Param() param: { id: number }) {
    return this.postsService.updatePost(body, param.id);
  }

  @Delete(':id')
  deletePost(@Param() param: { id: number }) {
    return this.postsService.deletePost(param.id);
  }
}
