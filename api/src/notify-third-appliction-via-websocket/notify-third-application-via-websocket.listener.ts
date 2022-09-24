import { WebSocketServer, WebSocketGateway, SubscribeMessage, OnGatewayInit } from "@nestjs/websockets"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server, Socket } from "socket.io"
import * as jwt from "jsonwebtoken"
import { TypeAuthCredential } from "src/common/types/type-auth-credential";

@WebSocketGateway()
export class NotifyThirdApplicationViaWebsocketListener {

    @WebSocketServer()
    private server: Server;

    async handleConnection(client: Socket) {
        try {
            let token = (client.handshake.headers.authorization)
            if (!token) {
                client.disconnect()
            }
            token = token.replace("Bearer ", "")
            const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
            // @ts-ignore
            if (decodedPayload.type !== TypeAuthCredential.WEBSOCKET) {
                client.disconnect()
            }
        } catch (error) {
            client.disconnect()
        }
    }

    @RabbitSubscribe({
        exchange: 'new_received_message_exchange',
        routingKey: '',
        queue: 'received_message_queue_to_trigger_websocket',
    })
    public async notifyNewReceivedMessage(msg: { [key: string]: any }) {
        this.server.emit("new_message", {
            body: msg.body,
            from: msg.from,
            name: msg.sender.displayName,
        })
    }
}