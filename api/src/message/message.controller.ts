import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { MessageDto } from "./message.dto";
import { MessageService } from "./message.service";

@Controller("/messages")
export class MessageController {

    constructor(
        private messageService: MessageService,
    ) { }

    @Get()
    public findAll() {
        return [
            {
                phone: "11111",
                text: "text text text"
            }
        ]
    }

    @Post()
    @HttpCode(201)
    public send(@Body() messageDto: MessageDto) {
        return this.messageService.send(messageDto)
    }
}
