import { Module } from '@nestjs/common';
import { NotifyThirdApplicationViaWebsocketListener } from "./notify-third-application-via-websocket.listener"

@Module({
    imports: [],
    providers: [NotifyThirdApplicationViaWebsocketListener],
})
export class NotifyThirdApplicationViaWebsocketModule {}
