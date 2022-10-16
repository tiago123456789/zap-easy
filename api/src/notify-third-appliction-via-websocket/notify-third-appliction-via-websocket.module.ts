import { Module } from '@nestjs/common';
import { SecurityModule } from 'src/security/security.module';
import { NotifyThirdApplicationViaWebsocketListener } from "./notify-third-application-via-websocket.listener"

@Module({
    imports: [
        SecurityModule
    ],
    providers: [NotifyThirdApplicationViaWebsocketListener],
})
export class NotifyThirdApplicationViaWebsocketModule {}
