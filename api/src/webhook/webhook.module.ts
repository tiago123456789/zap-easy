import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { Webhook } from './webhook.entity';
import { WebhookService } from './webhook.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Webhook]),
    ],
    controllers: [WebhookController],
    providers: [WebhookService, AmqpConnection]

})
export class WebhookModule {}
