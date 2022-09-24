import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
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
  providers: [MessageService, AmqpConnection],
})
export class MessagesModule { }
