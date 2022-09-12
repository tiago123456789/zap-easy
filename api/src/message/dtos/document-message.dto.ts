import { IsNotEmpty, Length } from 'class-validator';

export class DocumentMessageDto {
  
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  @Length(12, 14)
  to: string;

  @IsNotEmpty()
  document: string;
  
}