import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeMessage } from "src/common/types/type-message";
import { MessageDto } from "src/message/dtos/message.dto";
import { Repository } from "typeorm";
import { CreatedWebhookDto } from "./created-webhook.dto";
import { Webhook } from "./webhook.entity";
import Queue from "../common/constants/Queue"
import { ResponsePaginatedDto } from "./response-paginated.dto";

@Injectable()
export class WebhookService {

    constructor(
        @InjectRepository(Webhook) private repository: Repository<Webhook>,
        private amqpConnection: AmqpConnection,
    ) { }

    async findAll(page: number | undefined, itemsPerPage: number | undefined): Promise<ResponsePaginatedDto<Webhook>> {
        const skip = ( page - 1) * itemsPerPage;
        const registers = await this.repository.findAndCount({
            take: itemsPerPage || 2,
            skip: skip || 0
        });

        const data = registers[0]
        const total = registers[1]

        return new ResponsePaginatedDto<Webhook>(
            data, page, itemsPerPage, total
        )
    }

    async create(): Promise<CreatedWebhookDto> {
        const webhook = await this.repository.save(new Webhook());
        const url = `${process.env.APP_URL}${webhook.id}?key=${webhook.key}`
        return { url, ...webhook };
    }

    async notifyByWebhook(id, key, message: MessageDto) {
        const webhook = await this.repository.findOne(id);

        if (!webhook) {
            throw new NotFoundException("Webhook url not found.")
        }

        if (webhook.key !== key) {
            throw new ForbiddenException("You can't execute this action because don't have permission")
        }

        return this.amqpConnection.publish(
            Queue.NEW_MESSAGE.EXCHANGE,
            Queue.NEW_MESSAGE.ROUTING_KEY,
            { type: TypeMessage.TEXT, ...message }
        )
    }

}