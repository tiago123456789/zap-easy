import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server, Socket } from "socket.io"
import { AuthCredentialService } from "src/security/auth-credential.service";

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
    ) {}

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
        exchange: 'new_received_message_exchange',
        routingKey: '',
        queue: 'received_message_queue_to_trigger_websocket',
    })
    public async notifyNewReceivedMessage(msg: { [key: string]: any }) {
        this.server.emit("new_message", {
            body: msg.body,
            from: msg.from,
            name: msg.sender.displayName,
            base64Media: msg.base64Media,
            mimetype: msg.mimetype
        })
    }

}