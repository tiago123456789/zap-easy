import Producer from "../queue/Producer";
import { ILogger } from "../utils/ILogger";
import { ICommand } from "./ICommand";

export default class NotifyNewRecievedMessageCommand implements ICommand {

    constructor(
        private receivedMessageProducer: Producer,
        private logger: ILogger
    ) {
    }

    async execute(message: { [key: string]: any; }, client: any) {
        this.logger.info(`Notify new message recieved in instance named ${message.sessionName}`)
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