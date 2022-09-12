import { IsNotEmpty, Length } from 'class-validator';

export class MessageDto {
  
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @Length(12, 14)
  to: string;
}