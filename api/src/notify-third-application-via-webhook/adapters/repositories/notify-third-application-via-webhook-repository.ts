import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotifyThirdApplicationViaWebhook } from "src/notify-third-application-via-webhook/notify-third-application-via-webhook.entity";
import { Repository } from "typeorm";
import { RepositoryInterface } from "./repository.interface";

@Injectable()
export class NotifyThirdApplicationViaWebhookRepository
    implements RepositoryInterface<NotifyThirdApplicationViaWebhook> {

    constructor(
        @InjectRepository(NotifyThirdApplicationViaWebhook) private repository: Repository<NotifyThirdApplicationViaWebhook>,
    ) { }

    count(): Promise<Number> {
        return this.repository.count()
    }

    findOne(): Promise<NotifyThirdApplicationViaWebhook> {
        return this.repository.findOne();
    }

    save(newRegister: NotifyThirdApplicationViaWebhook): Promise<NotifyThirdApplicationViaWebhook> {
        return this.repository.save(newRegister)
    }

}