import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is my first post on the platform.',
    description: 'Post body content',
    minLength: 10,
  })
  @IsNotEmpty()
  @MinLength(10)
  content!: string;
}
