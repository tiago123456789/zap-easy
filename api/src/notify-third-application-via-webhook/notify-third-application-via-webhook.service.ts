import { NotifyThirdApplicationViaWebhook } from "./notify-third-application-via-webhook.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import axios from "axios"
import Queue from "../common/constants/Queue"


@Injectable()
export class NotifyThirdApplicationViaWebhookService {

  constructor(
    @InjectRepository(NotifyThirdApplicationViaWebhook) private repository: Repository<NotifyThirdApplicationViaWebhook>,
  ) { }

  async create(url: string) {
    const totalRegisters = await this.repository.count()
    if (totalRegisters > 0) {
      throw new Error("Already exist webhook registered, so you can't register new webhook. Tip: access your database to change url to wish value.")
    }

    const newRegister: NotifyThirdApplicationViaWebhook = new NotifyThirdApplicationViaWebhook()
    newRegister.url = url;
    return this.repository.save(newRegister)
  }

  @RabbitSubscribe({
    exchange: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK.EXCHANGE,
    routingKey: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK.ROUTING_KEY,
    queue: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK.QUEUE,
    queueOptions: {
      ...Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK.QUEUE_OPTIONS,
      // @ts-ignore
      arguments: {
        'x-dead-letter-exchange': Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK_DLQ.EXCHANGE,
        'x-dead-letter-routing-key': Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK_DLQ.ROUTING_KEY,
      }
    }
  })
  public async notifyNewReceivedMessage(msg: {}) {
    try {
      const webhookUrl = await this.repository.findOne();
      const url: string = `${webhookUrl.url}?key=${webhookUrl.key}`
      await axios.post(url, msg)
    } catch(error) {
      return new Nack(false)
    }
    
  }
}