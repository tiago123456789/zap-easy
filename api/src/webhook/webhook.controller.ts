import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageDto } from "src/message/dtos/message.dto";
import { AuthorizationGuard } from "src/security/authorization.guard";
import { WebhookService } from "./webhook.service";
import { CreatedWebhookDto } from './created-webhook.dto'


@ApiTags("Webhook")
@Controller("webhooks")
export class WebhookController {

  constructor(
    private readonly webhookService: WebhookService
  ) { }

  @ApiBearerAuth("TOKEN_JWT")
  @UseGuards(AuthorizationGuard)
  @ApiResponse({
    status: 403,
    description: "Action not allowed. The request needs send jwt token in request"
  })
  @ApiResponse({
    status: 200,
    type: CreatedWebhookDto,
    description: "The webhook created are returned"
  })
  @ApiParam({
    name: "page",
    description: "The page"
  })
  @ApiQuery({
    name: "itemsPerPage",
    description: "The total items return"
  })
  @Get("/")
  findAll(@Query("page") page: number, @Query("itemsPerPage") itensPerPage: number) {
    return this.webhookService.findAll(page, itensPerPage);
  }

  @ApiBearerAuth("TOKEN_JWT")
  @ApiResponse({
    status: 403,
    description: "Action not allowed. The request needs send jwt token in request"
  })
  @ApiResponse({
    status: 201,
    type: CreatedWebhookDto,
    description: "The webhook url to send text message via whatsapp is created"
  })
  @UseGuards(AuthorizationGuard)
  @Post()
  @HttpCode(201)
  @UseGuards(AuthorizationGuard)
  create(): Promise<CreatedWebhookDto> {
    return this.webhookService.create();
  }

  @ApiResponse({
    status: 201,
    description: "The request processed successfully"
  })
  @ApiResponse({
    status: 404,
    description: "The webhook url not found"
  })
  @ApiResponse({
    status: 403,
    description: "You try make request to the webhook url, but not specificied querystring <strong>key</strong> or <strong>key</strong> is invalid"
  })
  @ApiParam({
    name: "id",
    description: "The webhook id"
  })
  @ApiQuery({
    name: "key",
    description: "The <strong>key</strong> is used for validate if request sended to the third application is allow"
  })
  @Post("/:id")
  @HttpCode(201)
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