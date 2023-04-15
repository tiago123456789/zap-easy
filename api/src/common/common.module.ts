import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuth } from './adapters/auth/jwt-auth';
import { RabbitmqProducer } from './adapters/queue/rabbitmq-producer';
import { S3Storage } from './adapters/storage/s3-storage';
import { Provider } from './constants/provider';
import { Exchange, ExchangeType } from './constants/rabbitmq';

@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get("JWT_SECRET"),
                }
            }
        }),
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
    ],
    providers: [
        {
            provide: Provider.STORAGE,
            useClass: S3Storage
        },
        {
            provide: Provider.AUTH,
            useClass: JwtAuth
        },
        {
            provide: Provider.QUEUE_PRODUCER,
            useClass: RabbitmqProducer
        }
    ],
    exports: [
        {
            provide: Provider.STORAGE,
            useClass: S3Storage
        },
        {
            provide: Provider.AUTH,
            useClass: JwtAuth
        },
        {
            provide: Provider.QUEUE_PRODUCER,
            useClass: RabbitmqProducer
        }
    ]
})
export class CommonModule { }
