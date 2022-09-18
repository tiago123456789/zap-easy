require("dotenv").config();
import { create } from 'venom-bot'
import { io } from "socket.io-client"
import Consumer from './queue/Consumer';
import SendMessageCommand from "./commands/SendMessageCommand"
import App from './configs/App';
import Producer from './queue/Producer';
import NotifyNewRecievedMessageCommand from './commands/NotifyNewReceivedMessageCommand';

const sendMessageCommand = new SendMessageCommand();
const receivedMessageProducer = new Producer(App.EXCHANGE_NEW_RECEIVED_MESSAGE)
const notifyNewRecievedMessageCommand = new NotifyNewRecievedMessageCommand(
    receivedMessageProducer
)
const newMessageConsumer = new Consumer(
    App.QUEUE_NEW_MESSAGE,
    App.EXCHANGE_NEW_MESSAGE,
)

// const socket = io("http://localhost:3000")

// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx
// });

// socket.on("disconnect", () => {
//     console.log(socket.id); // undefined
// });


// create({
//     session: 'session',
// })
//     .then(async (client) => {

//         client.onMessage(async (message) => {
//             await notifyNewRecievedMessageCommand.execute(message, client)
//         })

//         newMessageConsumer
//             .setHandler(async (message: { [key: string]: any }) => {
//                 await sendMessageCommand.execute(message, client)
//             })
//             .listen()

//     })
//     .catch((err) => {
//         console.log(err);
//     });