import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  subTitle: string;
  content: string;

  @IsOptional()
  tags: string[];
  authorUid: string;
}
