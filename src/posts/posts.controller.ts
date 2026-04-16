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

  @Patch(':id')
  updatePost() {
    return this.postsService.updatePost();
  }

  @Delete(':id')
  deletePost() {
    return this.postsService.deletePost();
  }
}
