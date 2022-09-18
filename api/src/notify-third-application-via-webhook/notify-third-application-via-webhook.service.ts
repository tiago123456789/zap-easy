import { NotifyThirdApplicationViaWebhook } from "./notify-third-application-via-webhook.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import axios from "axios"

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
    exchange: 'new_received_message_exchange',
    routingKey: '',
    queue: 'received_message_queue',
  })
  public async notifyNewReceivedMessage(msg: {}) {
    const webhookUrl = await this.repository.findOne();
    const url: string = `${webhookUrl.url}?key=${webhookUrl.key}`
    await axios.post(url, msg)
  }
}