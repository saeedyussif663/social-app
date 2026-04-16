import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { OwnershipGuard } from 'src/guards/ownership.guard';
import { CreatePostDto } from './dto/post.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreatePostDto })
  @UseGuards(AuthGuard)
  @Post()
  createPost(@Req() req: Request, @Body() body: CreatePostDto) {
    if (req.user?.sub) {
      return this.postsService.createPost(body, req?.user.sub);
    }
  }

  @ApiOperation({ summary: 'List all posts' })
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: 'Get one post by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPost(id);
  }

  @ApiOperation({ summary: 'Update a post you own' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreatePostDto })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @UseGuards(AuthGuard, OwnershipGuard)
  @Patch(':id')
  updatePost(
    @Body() body: CreatePostDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.updatePost(body, id);
  }

  @ApiOperation({ summary: 'Delete a post you own' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @UseGuards(AuthGuard, OwnershipGuard)
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
