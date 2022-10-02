import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Media]),
  ],
  controllers: [MessageController],
  providers: [MessageService, AmqpConnection],
})
export class MessagesModule { }
