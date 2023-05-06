import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { MessageService } from "./message.service";

@Injectable()
export class MessageScheduler {

    constructor(private messageService: MessageService) {}

    @Cron(CronExpression.EVERY_5_MINUTES)
    triggerScheduledMessages() {
        this.messageService.triggerScheduledMessages();
    }
}