import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Module } from 'nestjs-s3';
import { Media } from './entities/media.entity';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Media]),
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

    S3Module.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          accessKeyId: configService.get("S3_CLIENT_ID"),
          secretAccessKey:  configService.get("S3_CLIENT_SECRET"),
        },
      }),
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessagesModule { }
