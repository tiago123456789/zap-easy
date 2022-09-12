require("dotenv").config();
import { create } from 'venom-bot'
import Consumer from './queue/Consumer';

create({
    session: 'session',
    multidevice: true
})
    .then((client) => {

        new Consumer(
            {
                name: "new_message_exchange",
                type: "direct",
                routingKey: "new_message",
                options: {}
            },
            async (message: { [key: string]: any }) => {
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
                return sendByType[message.type]();
            }
        ).listen()

    })
    .catch((err) => {
        console.log(err);
    });