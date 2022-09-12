import { IsNotEmpty, Length } from 'class-validator';

export class ImageMessageDto {
  
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @Length(12, 14)
  to: string;

  @IsNotEmpty()
  image: string;
  
}