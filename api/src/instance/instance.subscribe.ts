import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { DeadLetterOptions, Exchange, Queue, RoutingKey } from "src/common/constants/rabbitmq";
import { InstanceService } from "./instance.service";

@Injectable()
export class InstanceSubscribe {

    constructor(
        private readonly instanceService: InstanceService
    ) {}

    @RabbitSubscribe({
        exchange: Exchange.UPDATE_STATUS,
        routingKey: RoutingKey.UPDATE_STATUS,
        queue: Queue.UPDATE_STATUS,
        queueOptions: {
            durable: true,
            // @ts-ignore
            deadLetterExchange: DeadLetterOptions.EXCHANGE,
            deadLetterRoutingKey: DeadLetterOptions.ROUTING_KEY
        }
    })
    public async updateStatusInstance(msg: { [key: string]: any }) {
        try {
            await this.instanceService.update(msg.id, msg)
        } catch(error) {
            new Nack(false)
        }
    }
}