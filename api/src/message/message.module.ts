import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        RabbitMQModule.forRootAsync(RabbitMQModule, { 
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<any> => {
              return {
                exchanges: [
                  { 
                    name: configService.get('RABBIT_EXCHANGE_NEW_MESSAGE'), 
                    type:  configService.get('RABBIT_EXCHANGE_TYPE_NEW_MESSAGE') 
                  }
                ], 
                uri: configService.get("RABBIT_URI")
              }
            }
          }),
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessagesModule {}
