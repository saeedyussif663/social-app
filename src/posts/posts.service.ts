import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './entity/posts.entity';
import { PostMutate } from './types.posts';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async createPost(body: PostMutate, id: number) {
    const savedPost = this.postsRepository.create({ ...body, user: { id } });
    const post = await this.postsRepository.save(savedPost);
    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  async getAllPosts() {
    const posts = await this.postsRepository.find({
      relations: { user: true },
      select: {
        id: true,
        content: true,
        user: {
          username: true,
        },
      },
    });

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      postedBy: post.user.username,
    }));

    return transformedPosts;
  }

  async getPost(id: number) {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  updatePost() {
    return 'updating post';
  }

  deletePost() {
    return 'delete a post';
  }
}
