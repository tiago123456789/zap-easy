import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuth } from './adapters/auth/jwt-auth';
import { RabbitmqProducer } from './adapters/queue/rabbitmq-producer';
import { S3Storage } from './adapters/storage/s3-storage';
import { Provider } from './constants/provider';
import { Exchange, ExchangeType } from './constants/rabbitmq';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { WinstonLogger } from './adapters/logger/winston-logger';

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
                        },
                        {
                            name: Exchange.LOGOUT_INSTANCE,
                            type: ExchangeType.DIRECT
                        }
                    ],
                    uri: configService.get("RABBIT_URI")
                }
            }
        }),
        WinstonModule.forRootAsync({
            useFactory: () => {
                return {
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                    defaultMeta: { service: 'api' },
                    transports: [
                        new winston.transports.File({ dirname: 'logs', filename: 'error.log', level: 'error' }),
                        new winston.transports.File({ dirname: 'logs', filename: 'info.log', level: "info" }),
                    ],
                }
            }
        })
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
        },
        {
            provide: Provider.LOGGER,
            useClass: WinstonLogger
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
        },
        {
            provide: Provider.LOGGER,
            useClass: WinstonLogger
        }
    ]
})
export class CommonModule { }
