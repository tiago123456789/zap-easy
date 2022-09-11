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
            async (message: { [key: string]: any}) => {
                
                await client.sendText(`${message.to}@c.us`, message.text)
            }
        ).listen()

        client.onMessage(message => {
            // @ts-ignore
            console.log(message.from, message.text)
        })
    })
    .catch((erro) => {
        console.log(erro);
    });