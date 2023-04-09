import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

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
    CommonModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessagesModule { }
