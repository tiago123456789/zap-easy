import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class DocumentMessageDto {
  
  @ApiProperty({ 
    example: "Hi, look this document for me",
    description: "The text of document message"
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
    example: "data:application/pfd;base64,base_64_here",
    description: "Pass document in base64Url. Case you need send another type of document look this link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types"
  })
  @IsNotEmpty()
  document: string;

  instanceId?: string;
  
}