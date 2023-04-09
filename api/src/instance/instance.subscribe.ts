import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InstanceService } from "./instance.service";

@Injectable()
export class InstanceSubscribe {

    constructor(
        private readonly instanceService: InstanceService
    ) {}

    @RabbitSubscribe({
        exchange: 'update_status_instance',
        routingKey: 'update_status_routing_key',
        queue: 'update_status_instance_queue',
        queueOptions: {
            durable: true
        }
    })
    public async updateStatusInstance(msg: { [key: string]: any }) {
        await this.instanceService.update(msg.id, msg)
    }
}