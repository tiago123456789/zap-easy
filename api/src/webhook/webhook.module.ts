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
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<any> => {
                return {
                    exchanges: [
                        {
                            name: configService.get('RABBIT_EXCHANGE_NEW_MESSAGE'),
                            type: configService.get('RABBIT_EXCHANGE_TYPE_NEW_MESSAGE')
                        }
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
