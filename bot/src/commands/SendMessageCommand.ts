import { ICommand } from "./ICommand";

export default class SendMessageCommand implements ICommand {

    execute(message: { [key: string]: any; }, client: any): Promise<void> {
        const sendByType = {
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

                // @ts-ignore
                return sendByType[message.type]().catch(console.log);
    }

}