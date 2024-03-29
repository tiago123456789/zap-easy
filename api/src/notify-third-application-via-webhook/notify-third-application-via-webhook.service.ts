import { NotifyThirdApplicationViaWebhook } from "./notify-third-application-via-webhook.entity";
import { Inject, Injectable } from "@nestjs/common";
import { Provider } from "../common/constants/provider";
import { HttpClientInterface } from "./adapters/http-client/http-client.interface";
import { RepositoryInterface } from "./adapters/repositories/repository.interface";
import { LoggerInterface } from "src/common/adapters/logger/logger.interface";

@Injectable()
export class NotifyThirdApplicationViaWebhookService {

  constructor(
    @Inject(Provider.NOTIFY_THIRD_APPLICATION_VIA_WEBHOOK_REPOSITORY) private repository: RepositoryInterface<NotifyThirdApplicationViaWebhook>,
    @Inject(Provider.HTTP_CLIENT) private httpClient: HttpClientInterface,
    @Inject(Provider.LOGGER) private logger: LoggerInterface
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

  public async notifyNewReceivedMessage(msg: { [key: string ]: any }) {
    try {
      this.logger.info(`Starting process to notify message via webhook`)
      this.logger.info(`Getting webhook url to notify message`)
      const webhookUrl = await this.repository.findOne();
      if (!webhookUrl) {
        throw new Error("You need configure webhook url to receive notification the new message")
      }
      const url: string = `${webhookUrl.url}?key=${webhookUrl.key}`
      const response = await this.httpClient.post(url, msg, null)
      this.logger.info(`Sended to notify message via webhook`)
      return response;
    } catch(error) {
      this.logger.error(error);
      throw error;
    } 
  }
}