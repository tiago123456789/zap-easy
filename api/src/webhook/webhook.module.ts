import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { WebhookController } from './webhook.controller';
import { Webhook } from './webhook.entity';
import { WebhookService } from './webhook.service';
import { Provider } from 'src/common/constants/provider';
import { WebhookRepository } from './adapters/repositories/webhook-repository';
import { CommonModule } from 'src/common/common.module';
import { Exchange, ExchangeType } from 'src/common/constants/rabbitmq';

@Module({
    imports: [
        TypeOrmModule.forFeature([Webhook]),
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<any> => {
                return {
                    exchanges: [
                        {
                            name: Exchange.NEW_MESSAGE,
                            type: ExchangeType.DIRECT
                        }
                    ],
                    uri: configService.get("RABBIT_URI")
                }
            }
        }),
        CommonModule
    ],
    controllers: [WebhookController],
    providers: [
        WebhookService,
        { 
            provide: Provider.WEBHOOK_REPOSITORY,
            useClass: WebhookRepository
        }
    ]

})
export class WebhookModule { }
