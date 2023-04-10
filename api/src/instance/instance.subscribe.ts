import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { Exchange, Queue, RoutingKey } from "src/common/constants/rabbitmq";
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
            durable: true
        }
    })
    public async updateStatusInstance(msg: { [key: string]: any }) {
        await this.instanceService.update(msg.id, msg)
    }
}