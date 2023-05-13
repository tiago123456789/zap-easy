import { Injectable } from "@nestjs/common";
import { RabbitSubscribe, Nack,  } from "@golevelup/nestjs-rabbitmq";
import { NotifyThirdApplicationViaWebhookService } from "./notify-third-application-via-webhook.service";
import { Exchange, RoutingKey, Queue, DeadLetterOptions } from "src/common/constants/rabbitmq";

@Injectable()
export class NotifyThirdApplicationViaWebhookSubscribe {

  constructor(
    private notifyThirdApplicationViaWebhookService: NotifyThirdApplicationViaWebhookService
  ) { }

  @RabbitSubscribe({
    exchange: Exchange.NEW_RECEIVED_MESSAGE,
    routingKey: RoutingKey.NEW_RECEIVED_MESSAGE,
    queue: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK,
    queueOptions: {
      // @ts-ignore
      deadLetterExchange: DeadLetterOptions.EXCHANGE,
      deadLetterRoutingKey: DeadLetterOptions.ROUTING_KEY
    }
  })
  public async notifyNewReceivedMessage(msg: {}) {
    try {
      await this.notifyThirdApplicationViaWebhookService
        .notifyNewReceivedMessage(msg)
    } catch (error) {
      return new Nack(false)
    }

  }
}