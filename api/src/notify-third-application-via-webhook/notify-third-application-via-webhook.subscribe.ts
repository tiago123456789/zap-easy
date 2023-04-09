import { NotifyThirdApplicationViaWebhook } from "./notify-third-application-via-webhook.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import axios from "axios"
import { NotifyThirdApplicationViaWebhookService } from "./notify-third-application-via-webhook.service";

@Injectable()
export class NotifyThirdApplicationViaWebhookSubscribe {

  constructor(
    private notifyThirdApplicationViaWebhookService: NotifyThirdApplicationViaWebhookService
  ) { }

  @RabbitSubscribe({
    exchange: 'new_received_message_exchange',
    routingKey: '',
    queue: 'received_message_queue_to_trigger_webhook',
  })
  public async notifyNewReceivedMessage(msg: {}) {
    await this.notifyThirdApplicationViaWebhookService
              .notifyNewReceivedMessage(msg)
  }
}