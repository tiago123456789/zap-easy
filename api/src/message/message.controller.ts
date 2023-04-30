import { Body, Controller, Get, HttpCode, Post, UseFilters, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger"
import { AuthorizationGuard } from "src/security/authorization.guard";
import { AudioMessageDto } from "./dtos/audio-message.dto";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { Message } from "./entities/message.entity";
import { MessageService } from "./message.service";
import { ResponseTextMessageDto } from "./dtos/response-text-message.dto";
import { ResponseExceptionDto } from "src/common/exceptions/response-exception.dto";
import { TextMessageBatchDto } from "./dtos/text-message-batch.dto";
import { HandlerException } from "src/common/exceptions/handler.exception";


@ApiBearerAuth("TOKEN_JWT")
@ApiResponse({
    status: 403,
    type: ResponseExceptionDto,
    description: "Action not allowed. The request needs send jwt token in request"
})
@ApiTags("Messages")
@UseGuards(AuthorizationGuard)
@UseFilters(HandlerException)
@Controller("/messages")
export class MessageController {

    constructor(
        private messageService: MessageService,
    ) { }

    @ApiResponse({
        status: 201,
        type: ResponseTextMessageDto,
        description: "The text message sended successfully. WARNING: the message sending to queue to the bot consume and send message"
    })
    @Post()
    @HttpCode(201)
    public send(@Body() messageDto: MessageDto): Promise<Message> {
        return this.messageService.send(messageDto)
    }

    @ApiResponse({
        status: 202,
        description: "Accept request to send text message in batch successfully. WARNING: the messages sending to queue to the bot consume and send message"
    })
    @Post("/batch")
    @HttpCode(202)
    public sendTextMessagesInBatch(@Body() batchMessages: TextMessageBatchDto): Promise<void>  {
        return this.messageService.sendTextMessagesInBatch(batchMessages)
    }

    @ApiResponse({
        status: 201,
        type: Message,
        description: "The image message sended successfully. WARNING: the message sending to queue to the bot consume and send message"
    })
    @Post("/images")
    @HttpCode(201)
    public sendImage(@Body() imageMessageDto: ImageMessageDto) {
        return this.messageService.sendImage(imageMessageDto)
    }

    @ApiResponse({
        status: 201,
        type: Message,
        description: "The document message sended successfully. WARNING: the message sending to queue to the bot consume and send message"
    })
    @Post("/documents")
    @HttpCode(201)
    public sendDocument(@Body() documentMessageDto: DocumentMessageDto) {
        return this.messageService.sendDocument(documentMessageDto)
    }

    @ApiResponse({
        status: 201,
        type: Message,
        description: "The audio message sended successfully. WARNING: the message sending to queue to the bot consume and send message"
    })
    @Post("/audios")
    @HttpCode(201)
    public sendAudio(@Body() audioMessageDto: AudioMessageDto) {
        return this.messageService.sendAudio(audioMessageDto)
    }
}
