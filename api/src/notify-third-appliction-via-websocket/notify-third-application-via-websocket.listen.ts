import { WebSocketServer, WebSocketGateway, SubscribeMessage, MessageBody } from "@nestjs/websockets"
import { Server } from "socket.io"

@WebSocketGateway()
export class NotifyThirdApplicationViaWebsocketListener {

    @WebSocketServer()
    private server: Server;

    @SubscribeMessage('new_received_message')
    handleEvent(@MessageBody() data: string): void {
        console.log(JSON.stringify(data))
        console.log("@@@@@@@@@@@@@@@@@@@@@")
        console.log("@@@@@@@@@@@@@@@@@@@@@")
        console.log("@@@@@@@@@@@@@@@@@@@@@")
        console.log("@@@@@@@@@@@@@@@@@@@@@")

        // this.server.emit("new_message_received", data)
    }

}