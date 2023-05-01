import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ImageMessageDto {

  @ApiProperty({ 
    example: "Hi, look this image",
    description: "The text of image message"
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

  @ApiProperty({ 
    example: "data:image/png;base64,base_64_here",
    description: "Pass image in base64Url"
  })
  @IsNotEmpty()
  image: string;

  instanceId;
  
}