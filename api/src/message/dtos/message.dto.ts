import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class MessageDto {
  
  @ApiProperty({ 
    example: "Hi how are you doing?",
    description: "The text message you go to send to what'sapp phone number"
  })
  @IsNotEmpty()
  text: string;

  @ApiProperty({ 
    example: "551112341234",
    description: "The what'sapp phone number of person you need send text message. Example of phone number: 5562911112222 of structure of phone number is country code + DDD + phone number"
  })
  @IsNotEmpty()
  @Length(12, 14)
  to: string;
}