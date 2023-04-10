import { Injectable } from "@nestjs/common";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { NotifyThirdApplicationViaWebhookService } from "./notify-third-application-via-webhook.service";
import { Exchange, RoutingKey, Queue } from "src/common/constants/rabbitmq";

@Injectable()
export class NotifyThirdApplicationViaWebhookSubscribe {

  constructor(
    private notifyThirdApplicationViaWebhookService: NotifyThirdApplicationViaWebhookService
  ) { }

  @RabbitSubscribe({
    exchange: Exchange.NEW_RECEIVED_MESSAGE,
    routingKey: RoutingKey.NEW_RECEIVED_MESSAGE,
    queue: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK,
  })
  public async notifyNewReceivedMessage(msg: {}) {
    await this.notifyThirdApplicationViaWebhookService
              .notifyNewReceivedMessage(msg)
  }
}