import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger"
import { AuthorizationGuard } from "src/security/authorization.guard";
import { AudioMessageDto } from "./dtos/audio-message.dto";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { Message } from "./entities/message.entity";
import { MessageService } from "./message.service";


@ApiBearerAuth("TOKEN_JWT")
@ApiResponse({
    status: 403,
    description: "Action not allowed. The request needs send jwt token in request"
})
@ApiTags("Messages")
@UseGuards(AuthorizationGuard)
@Controller("/messages")
export class MessageController {

    constructor(
        private messageService: MessageService,
    ) { }

    @ApiBearerAuth("TOKEN_JWT")
    @ApiResponse({
        status: 403,
        description: "Action not allowed. The request needs send jwt token in request"
    })
    @ApiResponse({
        status: 200,
        type: Message,
        description: "The webhook created are returned"
    })
    @ApiParam({
        name: "page",
        description: "The page"
    })
    @ApiQuery({
        name: "itemsPerPage",
        description: "The total items return"
    })
    @Get("/")
    findAll(@Query("page") page: number, @Query("itemsPerPage") itensPerPage: number) {
        return this.messageService.findAllPaginate(page, itensPerPage);
    }

    @ApiResponse({
        status: 201,
        type: Message,
        description: "The text message sended successfully. WARNING: the message sending to queue to the bot consume and send message"
    })
    @Post()
    @HttpCode(201)
    public send(@Body() messageDto: MessageDto): Promise<Message> {
        return this.messageService.send(messageDto)
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
