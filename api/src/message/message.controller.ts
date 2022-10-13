import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger"
import { AuthorizationGuard } from "src/security/authorization.guard";
import { AudioMessageDto } from "./dtos/audio-message.dto";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { MessageService } from "./message.service";

@ApiTags("Messages")
@UseGuards(AuthorizationGuard)
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
    public sendDocument(@Body() documentMessageDto: DocumentMessageDto) {
        return this.messageService.sendDocument(documentMessageDto)
    }

    @Post("/audios")
    @HttpCode(201)
    public sendAudio(@Body() audioMessageDto: AudioMessageDto) {
        return this.messageService.sendAudio(audioMessageDto)
    }
}
