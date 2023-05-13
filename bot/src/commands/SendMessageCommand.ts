import { ILogger } from "../utils/ILogger";
import { ICommand } from "./ICommand";

export default class SendMessageCommand implements ICommand {

    constructor(private logger: ILogger) { }

    execute(message: { [key: string]: any; }, client: any): Promise<void> {
        const sendByType: { [key: string]: Function } = {
            "image": () => {
                return client.sendImageFromBase64(
                    `${message.to}@c.us`,
                    message.image,
                    "file",
                    message.text
                );
            },
            "voice": () => {
                return client
                    .sendVoiceBase64(
                        `${message.to}@c.us`,
                        message.audio,
                    )
            },
            "document": () => {
                return client
                    .sendFileFromBase64(
                        `${message.to}@c.us`,
                        message.document,
                        'file',
                        message.text
                    )
            },
            "text": () => {
                return client.sendText(`${message.to}@c.us`, message.text)
            }
        }

        this.logger.info(`Sending new ${message.type} message in instance named ${message.sessionName}`)
        return sendByType[message.type]()
            .then(() => {
                this.logger.info(`Sended new ${message.type} message in instance named ${message.sessionName}`)
            })
            .catch(this.logger.error);
    }

}