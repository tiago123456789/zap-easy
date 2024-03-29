import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets"
import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq"
import { Server, Socket } from "socket.io"
import { AuthCredentialService } from "src/security/auth-credential.service";
import { DeadLetterOptions, Exchange, Queue, RoutingKey } from "src/common/constants/rabbitmq";

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
    ) { }

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
        exchange: Exchange.NEW_RECEIVED_MESSAGE,
        routingKey: RoutingKey.NEW_RECEIVED_MESSAGE,
        queue: Queue.NEW_RECEIVED_MESSAGE_EXCHANGE,
        queueOptions: {
            // @ts-ignore
            deadLetterExchange: DeadLetterOptions.EXCHANGE,
            deadLetterRoutingKey: DeadLetterOptions.ROUTING_KEY
        }
    })
    public async notifyNewReceivedMessage(msg: { [key: string]: any }) {
        try {
            this.server.emit("new_message", msg)
        } catch (error) {
            new Nack(false)
        }
    }

}