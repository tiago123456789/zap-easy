import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { Webhook } from './webhook.entity';
import { WebhookService } from './webhook.service';
import Queue from "../common/constants/Queue"

@Module({
    imports: [
        TypeOrmModule.forFeature([Webhook]),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<any> => {
                return {
                    exchanges: [
                        {
                            name: Queue.NEW_MESSAGE.EXCHANGE,
                            type: Queue.NEW_MESSAGE.TYPE
                        },
                    ],
                    uri: configService.get("RABBIT_URI")
                }
            }
        }),
    ],
    controllers: [WebhookController],
    providers: [WebhookService]

})
export class WebhookModule { }
