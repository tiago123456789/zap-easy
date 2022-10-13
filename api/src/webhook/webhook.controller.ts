import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageDto } from "src/message/dtos/message.dto";
import { AuthorizationGuard } from "src/security/authorization.guard";
import { WebhookService } from "./webhook.service";
import { CreatedWebhookDto } from './created-webhook.dto'

@ApiTags("Webhook")
@Controller("webhooks")
export class WebhookController {

    constructor(
        private readonly webhookService: WebhookService
    ) {}

    @ApiResponse({
      status: 200,
      type: CreatedWebhookDto,
    })
    @UseGuards(AuthorizationGuard)
    @Post()
    @HttpCode(201)
    @UseGuards(AuthorizationGuard)
    create(): Promise<CreatedWebhookDto> {
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