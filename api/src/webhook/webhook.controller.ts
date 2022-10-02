import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { MessageDto } from "src/message/dtos/message.dto";
import { AuthorizationGuard } from "src/security/authorization.guard";
import { WebhookService } from "./webhook.service";

@Controller("webhooks")
export class WebhookController {

    constructor(
        private readonly webhookService: WebhookService
    ) {}

    @UseGuards(AuthorizationGuard)
    @Post()
    @HttpCode(201)
    @UseGuards(AuthorizationGuard)
    create() {
        return this.webhookService.create();
    }

    @Post("/:id")
    notifyByWebhook(
        @Param("id") id: string, 
        @Query("key") key: string, 
        @Body() message: MessageDto
    ) {
        return this.webhookService.notifyByWebhook(
            id, key, message
        )
    }
}