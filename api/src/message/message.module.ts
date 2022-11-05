import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import Queue from "../common/constants/Queue"

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Media]),
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
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessagesModule { }
