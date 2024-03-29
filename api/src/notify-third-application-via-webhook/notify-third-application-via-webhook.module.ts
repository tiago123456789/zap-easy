import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from 'src/common/constants/provider';
import { AxiosHttpClient } from './adapters/http-client/axios-http-client';
import { NotifyThirdApplicationViaWebhookRepository } from './adapters/repositories/notify-third-application-via-webhook-repository';
import { NotifyThirdApplicationViaWebhookCommand } from "./notify-third-application-via-webhook.command"
import { NotifyThirdApplicationViaWebhook } from './notify-third-application-via-webhook.entity';
import { NotifyThirdApplicationViaWebhookService } from './notify-third-application-via-webhook.service';
import { NotifyThirdApplicationViaWebhookSubscribe } from './notify-third-application-via-webhook.subscribe';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotifyThirdApplicationViaWebhook]),
        CommonModule
    ],
    providers: [
        NotifyThirdApplicationViaWebhookService, 
        NotifyThirdApplicationViaWebhookCommand,
        NotifyThirdApplicationViaWebhookSubscribe,
        {
            provide: Provider.HTTP_CLIENT,
            useClass: AxiosHttpClient
        }, 
        {
            provide: Provider.NOTIFY_THIRD_APPLICATION_VIA_WEBHOOK_REPOSITORY,
            useClass: NotifyThirdApplicationViaWebhookRepository
        }
    ],
    exports: [NotifyThirdApplicationViaWebhookCommand]

})
export class NotifyThirdApplicationViaWebhookModule {}
