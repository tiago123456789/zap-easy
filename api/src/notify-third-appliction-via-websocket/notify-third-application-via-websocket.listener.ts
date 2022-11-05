import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets"
import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server, Socket } from "socket.io"
import { AuthCredentialService } from "src/security/auth-credential.service";
import Queue from "../common/constants/Queue"

@WebSocketGateway({
    cors: {
        origin: "*",
        allowedHeaders: ["Authorization"],
        credentials: true
    }
})
export class NotifyThirdApplicationViaWebsocketListener {

    constructor(
        private readonly authCredentialService: AuthCredentialService
    ) {

    }

    @WebSocketServer()
    private server: Server;

    async handleConnection(client: Socket) {
        try {
            let clientId = client.handshake.query.token
            if (clientId) {
                await this.authCredentialService.authenticateClientWebsocket(
                    // @ts-ignore
                    clientId, client.handshake.headers.origin
                )
                return;
            }

            let token = (client.handshake.headers.authorization)
            await this.authCredentialService.hasJwtTokenValid(token)
        } catch (error) {
            client.disconnect()
        }
    }

    @RabbitSubscribe({
        exchange: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET.EXCHANGE,
        routingKey: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET.ROUTING_KEY,
        queue: Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET.QUEUE,
        queueOptions: {
            ...Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET.QUEUE_OPTIONS,
            // @ts-ignore
            arguments: {
                'x-dead-letter-exchange': Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET_DLQ.EXCHANGE,
                'x-dead-letter-routing-key': Queue.RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET_DLQ.ROUTING_KEY,
            }
        }
    })
    public async notifyNewReceivedMessage(msg: { [key: string]: any }) {
        try {
            this.server.emit("new_message", {
                body: msg.body,
                from: msg.from,
                name: msg.sender.displayName,
                base64Media: msg.base64Media,
                mimetype: msg.mimetype
            })
        } catch(error) {
            return new Nack(false);
        }
    }

}