import Producer from "../queue/Producer";
import { ICommand } from "./ICommand";

export default class NotifyNewRecievedMessageCommand implements ICommand {

    private receivedMessageProducer: Producer;

    constructor(receivedMessageProducer: Producer) {
        this.receivedMessageProducer = receivedMessageProducer
    }

    async execute(message: { [key: string]: any; }, client: any) {
        if (
            message.isGroupMsg === false && 
            (message.isMedia === true || message.isMMS === true)
        ) {
            const buffer = await client.decryptFile(message);
            // @ts-ignore
            message.base64Media = buffer.toString('base64')
            await this.receivedMessageProducer.publish(message)
        } else if (message.isGroupMsg === false) {
            await this.receivedMessageProducer.publish(message)
        }
    }

}