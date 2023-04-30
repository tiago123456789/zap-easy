import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TextMessage } from "../common/adapters/queue/messages/text-message";
import { ProducerInterface } from "../common/adapters/queue/producer.interface";
import { Provider } from "../common/constants/provider";
import { Exchange, RoutingKey } from "../common/constants/rabbitmq";
import { MessageDto } from "../message/dtos/message.dto";
import { CreatedWebhookDto } from "./created-webhook.dto";
import { Webhook } from "./webhook.entity";
import { RepositoryInterface } from "./adapters/repositories/repository.interface";

@Injectable()
export class WebhookService {

    constructor(
        @Inject(Provider.WEBHOOK_REPOSITORY) private repository: RepositoryInterface<Webhook>,
        @Inject(Provider.QUEUE_PRODUCER) private queueProducer: ProducerInterface,
    ) { }

    async create(): Promise<CreatedWebhookDto> {
        const webhook = await this.repository.save(new Webhook());
        const url = `${process.env.APP_URL}webhooks/${webhook.id}?key=${webhook.key}`
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
                routingKey: RoutingKey.NEW_MESSAGE,
                exchange: Exchange.NEW_MESSAGE
            },
            new TextMessage(message.text, message.to)
        )
    }

}