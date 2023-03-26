import { QueueMessage } from "./messages/queue-message.interface";
import { ParamsPublish } from "./params-publish.interface";


export interface ProducerInterface {

    publish(params: ParamsPublish, message: QueueMessage): Promise<void>
    publishMany(params: ParamsPublish, messages: QueueMessage[]): Promise<void>

}