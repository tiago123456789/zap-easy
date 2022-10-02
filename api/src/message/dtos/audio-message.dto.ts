import { IsNotEmpty, Length } from 'class-validator';

export class AudioMessageDto {
  
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @Length(12, 14)
  to: string;

  @IsNotEmpty()
  audio: string;
  
}