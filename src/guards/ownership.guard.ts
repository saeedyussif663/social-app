import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { type Request } from 'express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.user) return false;
    const userId = request?.user.sub;
    const postId = Number(request.params.id);

    const post = await this.postsService.getPostOwner(postId);

    if (post?.user.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return true;
  }
}
