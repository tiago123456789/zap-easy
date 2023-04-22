import Producer from "../queue/Producer";
import { ICommand } from "./ICommand";

export default class NotifyNewRecievedMessageCommand implements ICommand {

    private receivedMessageProducer: Producer;

    constructor(receivedMessageProducer: Producer) {
        this.receivedMessageProducer = receivedMessageProducer
    }

    async execute(message: { [key: string]: any; }, client: any) {
        if (message.mimetype) {
            const buffer = await client.decryptFile(message);
            message.base64Media = buffer.toString('base64')
            await this.receivedMessageProducer.publish({
                body: null,
                from: message.from,
                name: message.sender.displayName,
                base64Media: message.base64Media,
                mimetype: message.mimetype
            })
        } else {
            await this.receivedMessageProducer.publish({
                body: message.body,
                from: message.from,
                name: message.sender.displayName,
                base64Media: null,
                mimetype: null
            })
        }
    }

}