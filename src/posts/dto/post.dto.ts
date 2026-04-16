import { IsNotEmpty, MinLength } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  @MinLength(10)
  content!: string;
}
