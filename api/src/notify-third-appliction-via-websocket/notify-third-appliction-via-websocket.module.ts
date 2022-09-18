import { Module } from '@nestjs/common';
import { NotifyThirdApplicationViaWebsocketListener } from "./notify-third-application-via-websocket.listen"

@Module({
    imports: [NotifyThirdApplicationViaWebsocketListener],
})
export class NotifyThirdApplicationViaWebsocketModule {}
