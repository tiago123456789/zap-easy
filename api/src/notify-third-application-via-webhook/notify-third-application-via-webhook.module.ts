// import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifyThirdApplicationViaWebhookCommand } from "./notify-third-application-via-webhook.command"
import { NotifyThirdApplicationViaWebhook } from './notify-third-application-via-webhook.entity';
import { NotifyThirdApplicationViaWebhookService } from './notify-third-application-via-webhook.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotifyThirdApplicationViaWebhook]),
    ],
    providers: [NotifyThirdApplicationViaWebhookService, NotifyThirdApplicationViaWebhookCommand],
    exports: [NotifyThirdApplicationViaWebhookCommand]

})
export class NotifyThirdApplicationViaWebhookModule {}
