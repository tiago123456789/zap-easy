require("dotenv").config();
import fs from "fs"
import path from "path";
import { create } from 'venom-bot'
import Consumer from './queue/Consumer';
import SendMessageCommand from "./commands/SendMessageCommand"
import App from './configs/App';
import Producer from './queue/Producer';
import NotifyNewRecievedMessageCommand from './commands/NotifyNewReceivedMessageCommand';
import SaveQrcodeCommand from "./commands/SaveQrcodeCommand"
import Instance from "./utils/Instance";

const sendMessageCommand = new SendMessageCommand();
const updateStatusInstanceProcuder = new Producer(App.EXCHANGE_UPDATE_STATUS_INSTANCE)
const receivedMessageProducer = new Producer(App.EXCHANGE_NEW_RECEIVED_MESSAGE)
const notifyNewRecievedMessageCommand = new NotifyNewRecievedMessageCommand(
    receivedMessageProducer
)
const newMessageConsumer = new Consumer(
    App.QUEUE_NEW_MESSAGE,
    App.EXCHANGE_NEW_MESSAGE,
)

const saveQrcodeCommand = new SaveQrcodeCommand()
const startApp = async () => {
    const sessionName = Instance.getId();
    if (!sessionName) {
        throw new Error("You need specific instance id. For example: npm run start:dev -- innstance_id_here or pm2 start 'npm run start' --name='bot_name_here' -- instance_id_here")
    }

    // await updateStatusInstanceProcuder.publish({
    //     id: sessionName,
    //     isOnline: false
    // })
    // const pathSession = (path.join(__dirname, "..", "tokens", sessionName))
    // fs.rmdirSync(pathSession, { recursive: true });

    create({
        headless: false,
        session: sessionName,
        catchQR: async (base64Qrimg: string, asciiQR: string, attempt: number, urlCode?: string) => {
            await saveQrcodeCommand.execute({
                filename: `${sessionName}.png`,
                content: urlCode,
                contentType: "binary"
            }, null)
        },
    })
        .then(async (client) => {
            try {
                await client.sendContactVcard("556285615483@c.us", "5511970339895@c.us", 'new contact')
            } catch(error) {
                console.log(error);
            }
            // const chats = await client.getAllChatsGroups('testando-bot@g.us');
            // console.log(
                // chats
                // .filter(item => item.id.server == "g.us")
                // .filter(item => item("g.us"))
            // )
            // await client.addParticipant('00000000-000000@g.us', '111111111111@c.us');
            // setInterval(async () => {
            //     const isOnline = await client.isConnected()
            //     await updateStatusInstanceProcuder.publish({
            //         id: sessionName,
            //         isOnline
            //     })
            // }, (60 * 1000));

            // client.onMessage(async (message) => {
            //     await notifyNewRecievedMessageCommand.execute(message, client)
            // })

            // newMessageConsumer
            //     .setHandler(async (message: { [key: string]: any }) => {
            //         await sendMessageCommand.execute(message, client)
            //     })
            //     .listen()
        })
        .catch(async (erro) => {
            console.log(erro);
            process.exit(0)
        });
}

startApp();