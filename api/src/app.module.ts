import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './message/message.module';
import { CommonModule } from './common/common.module';
import { SecurityModule } from './security/security.module';
import { WebhookModule } from './webhook/webhook.module';
import { NotifyThirdApplicationViaWebhookModule } from './notify-third-application-via-webhook/notify-third-application-via-webhook.module';
import { NotifyThirdApplicationViaWebsocketModule } from './notify-third-appliction-via-websocket/notify-third-appliction-via-websocket.module';
import { InstanceModule } from './instance/instance.module';
import { S3Module } from 'nestjs-s3';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => {
        return {
          type: configService.get("DATABASE_TYPE"),
          host: configService.get("DATABASE_HOST"),
          port: configService.get("DATABASE_PORT"),
          username: configService.get("DATABASE_USER"),
          password: configService.get("DATABASE_PASSWORD"),
          database: configService.get("DATABASE_NAME"),
          autoLoadEntities: true,
          synchronize: true,
          logging: configService.get("ENV") == "dev" ? true : false
        };
      }
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => {
        return {
          exchanges: [
            {
              name: 'update_status_instance',
              type: 'direct'
              // routingKey: 'update_status_routing_key',
            },
            {
              name: configService.get('RABBIT_EXCHANGE_NEW_MESSAGE'),
              type: configService.get('RABBIT_EXCHANGE_TYPE_NEW_MESSAGE')
            },
            {
              name: configService.get('RABBIT_EXCHANGE_NEW_RECEIVED_MESSAGE'),
              type: configService.get('RABBIT_EXCHANGE_TYPE_NEW_RECEIVED_MESSAGE')
            }
          ],
          uri: configService.get("RABBIT_URI")
        }
      }
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get("S3_CLIENT_ID"),
          secretAccessKey:  configService.get("S3_CLIENT_SECRET"),
        },
      }),
    }),
    CommonModule,
    MessagesModule,
    SecurityModule,
    WebhookModule,
    NotifyThirdApplicationViaWebhookModule,
    NotifyThirdApplicationViaWebsocketModule,
    InstanceModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => {
        return {
          exchanges: [
            {
              name: configService.get('RABBIT_EXCHANGE_NEW_MESSAGE'),
              type: configService.get('RABBIT_EXCHANGE_TYPE_NEW_MESSAGE')
            },
            {
              name: configService.get('RABBIT_EXCHANGE_NEW_RECEIVED_MESSAGE'),
              type: configService.get('RABBIT_EXCHANGE_TYPE_NEW_RECEIVED_MESSAGE')
            }
          ],
          uri: configService.get("RABBIT_URI")
        }
      }
    }),
    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get("S3_CLIENT_ID"),
          secretAccessKey:  configService.get("S3_CLIENT_SECRET"),
        },
      }),
    }),
  ]
})
export class AppModule { }
