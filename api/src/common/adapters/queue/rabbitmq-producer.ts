import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { QueueMessage } from "./messages/queue-message.interface";
import { ParamsPublish } from "./params-publish.interface";
import { ProducerInterface } from "./producer.interface";

@Injectable()
export class RabbitmqProducer implements ProducerInterface {

    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) { }

    async publish(params: ParamsPublish, message: QueueMessage): Promise<void> {
        await this.amqpConnection.publish(
            params.exchange,
            params.routingKey,
            message.get()
        )
    }

    async publishMany(params: ParamsPublish, messages: QueueMessage[]): Promise<void> {
        let promisesToPublishMessage = []
        for (let index = 0; index < messages.length; index++) {
            promisesToPublishMessage.push(
                this.publish(params, messages[index])
            )

            if (promisesToPublishMessage.length === 4) {
                await Promise.all(promisesToPublishMessage)
                promisesToPublishMessage = []
            }
        }

        if (promisesToPublishMessage.length > 0) {
            await Promise.all(promisesToPublishMessage)
            promisesToPublishMessage = [] 
        }
    }

}