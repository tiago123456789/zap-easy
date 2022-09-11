import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MessageDto } from "./message.dto";
import { Message } from "./message.entity";

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private repository: Repository<Message>,
        private readonly amqpConnection: AmqpConnection
    ) {}

    async send(messageDto: MessageDto) {
        const message: Message = new Message()
        message.text = messageDto.text;
        message.to = messageDto.to;
        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        const messageCreated = this.repository.save(message)
        await this.amqpConnection.publish(
            process.env.RABBIT_EXCHANGE_NEW_MESSAGE, "new_message", messageDto
        )

        return messageCreated
    }

}