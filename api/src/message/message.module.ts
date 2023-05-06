import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';
import { ConfigService } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';
import { Provider } from 'src/common/constants/provider';
import { MessageRepository } from './adapters/repositories/message-repository';
import { Exchange, ExchangeType } from 'src/common/constants/rabbitmq';
import { MediaRepository } from './adapters/repositories/media-repository';
import { InstanceModule } from 'src/instance/instance.module';
import { ScheduleMessageRepository } from './adapters/repositories/schedule-message-repository';
import { ScheduleMessage } from './entities/schedule-message.entity';
import { MessageSubscribe } from './message.subscribe';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Media, ScheduleMessage]),
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
    CommonModule,
    InstanceModule
  ],
  controllers: [MessageController],
  providers: [
    MessageService,  
    {
      provide: Provider.MESSAGE_REPOSITORY,
      useClass: MessageRepository
    },
    { 
      provide: Provider.MEDIA_REPOSITORY,
      useClass: MediaRepository
    },
    {
      provide: Provider.SCHEDULE_MESSAGE_REPOSITORY,
      useClass: ScheduleMessageRepository
    },
    MessageSubscribe
  ],
})
export class MessagesModule { }
