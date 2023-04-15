import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets"
import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server, Socket } from "socket.io"
import { AuthCredentialService } from "src/security/auth-credential.service";
import { Exchange, Queue, RoutingKey } from "src/common/constants/rabbitmq";

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
            console.log("passed on here")
            let clientId = client.handshake.query.token
            console.log(clientId)
            if (clientId) {
                await this.authCredentialService.authenticateClientWebsocket(
                    // @ts-ignore
                    clientId, client.handshake.headers.origin
                )
                return;
            }

            let token = (client.handshake.headers.authorization)
            console.log(token)
            await this.authCredentialService.hasJwtTokenValid(token)
        } catch (error) {
            client.disconnect()
        }
    }

    @RabbitSubscribe({
        exchange: Exchange.NEW_RECEIVED_MESSAGE,
        routingKey: RoutingKey.NEW_RECEIVED_MESSAGE,
        queue: Queue.NEW_RECEIVED_MESSAGE_EXCHANGE
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