import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { MessageService } from "./message.service";

@Controller("/messages")
export class MessageController {

    constructor(
        private messageService: MessageService,
    ) { }

    @Post()
    @HttpCode(201)
    public send(@Body() messageDto: MessageDto) {
        return this.messageService.send(messageDto)
    }

    @Post("/images")
    @HttpCode(201)
    public sendImages(@Body() imageMessageDto: ImageMessageDto) {
        return this.messageService.sendImage(imageMessageDto)
    }

    @Post("/documents")
    @HttpCode(201)
    public sendDocuments(@Body() documentMessageDto: DocumentMessageDto) {
        return this.messageService.sendDocument(documentMessageDto)
    }
}
