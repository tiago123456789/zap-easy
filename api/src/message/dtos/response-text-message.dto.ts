import { ApiProperty } from "@nestjs/swagger";

export class ResponseTextMessageDto {

    @ApiProperty({
        example: "Hi how are you doing?",
        description: "The text message you go to send to what'sapp phone number"
    })
    text: string;

    @ApiProperty({
        example: "551112341234",
        description: "The what'sapp phone number of person you need send text message. Example of phone number: 5562911112222 of structure of phone number is country code + DDD + phone number"
    })
    to: string;

    @ApiProperty({ 
        example: "2023-04-29T11:23:02.775Z",
        description: "The date register created"
    })
    createdAt: Date;

    @ApiProperty({ 
        example: "2023-04-29T11:23:02.775Z",
        description: "The date register updated. The updatedAt have same value the createdAt in moment create register"
    })
    updatedAt: Date;

    @ApiProperty({ 
        example: "2023-04-29T11:23:02.775Z",
        description: "The date register sended to queue where What'sapp will send message"
    })
    sendedAt: string;

    @ApiProperty({ 
        example: "6ef3d5d0-c4a3-436b-a01b-b23d44bd88cf",
        description: "The id is generate per database"
    })
    id: String;
}