import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MessageService } from "./message.service";

@Injectable()
export class MessageScheduler {

    constructor(private messageService: MessageService) {}

    @Cron(CronExpression.EVERY_5_MINUTES, { disabled: new Boolean(process.env.DISABLE_CRONJOB).valueOf() })
    triggerScheduledMessages() {
        this.messageService.triggerScheduledMessages();
    }
}