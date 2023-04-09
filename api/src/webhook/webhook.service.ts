import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TextMessage } from "src/common/adapters/queue/messages/text-message";
import { ProducerInterface } from "src/common/adapters/queue/producer.interface";
import { Provider } from "src/common/constants/provider";
import { RepositoryInterface } from "src/message/adapters/repositories/repository.interface";
import { MessageDto } from "src/message/dtos/message.dto";
import { CreatedWebhookDto } from "./created-webhook.dto";
import { Webhook } from "./webhook.entity";

@Injectable()
export class WebhookService {

    constructor(
        @Inject(Provider.WEBHOOK_REPOSITORY) private repository: RepositoryInterface<Webhook>,
        @Inject(Provider.QUEUE_PRODUCER) private queueProducer: ProducerInterface,
    ) { }

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

        return this.queueProducer.publish(
            {
                routingKey: "new_message",
                exchange: process.env.RABBIT_EXCHANGE_NEW_MESSAGE,
            },
            new TextMessage(message.text, message.to)
        )
    }

}