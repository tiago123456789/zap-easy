require("dotenv").config();
import path from "path";
import { create } from 'venom-bot'
import Consumer from './queue/Consumer';
import SendMessageCommand from "./commands/SendMessageCommand"
import App from './configs/App';
import Producer from './queue/Producer';
import NotifyNewRecievedMessageCommand from './commands/NotifyNewReceivedMessageCommand';
import SaveQrcodeCommand from "./commands/SaveQrcodeCommand"
import Instance from "./utils/Instance";
import LogoutInstanceCommand from "./commands/LogoutInstanceCommand";
import RemoveCredentialsInstance from "./commands/RemoveCredentialsInstance";

const sendMessageCommand = new SendMessageCommand();
const logoutInstanceCommand = new LogoutInstanceCommand();
const removeCredentialsInstance = new RemoveCredentialsInstance();
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

    const logoutInstanceConsumer = new Consumer(
        {
            ...App.QUEUE_LOGOUT_INSTANCE,
            name: `${App.QUEUE_LOGOUT_INSTANCE.name}${sessionName}`
        },
        {
            ...App.EXCHANGE_LOGOUT_INSTANCE,
            routingKey: sessionName
        }
    )

    await updateStatusInstanceProcuder.publish({
        id: sessionName,
        isOnline: false
    })
    
    const pathSession = (path.join(__dirname, "..", "tokens", sessionName))
    removeCredentialsInstance.execute(
        { pathSession }, 
        null
    )

    create({
        headless: true,
        session: sessionName,
        useChrome: false,
        catchQR: async (base64Qrimg: string, asciiQR: string, attempt: number, urlCode?: string) => {
            await updateStatusInstanceProcuder.publish({
                id: sessionName,
                isOnline: true
            })
            await saveQrcodeCommand.execute({
                filename: `${sessionName}.png`,
                content: urlCode,
                contentType: "binary"
            }, null)
        },
    })
        .then(async (client) => {
            logoutInstanceConsumer
                .setHandler(async (data: any) => {})
                .setHandlerAfterAck(() => {
                    logoutInstanceCommand.execute(
                        { sessionName }, 
                        null
                    )
                })
                .listen()

            setInterval(async () => {
                const isOnline = await client.isConnected()
                await updateStatusInstanceProcuder.publish({
                    id: sessionName,
                    isOnline
                })
            }, (60 * 1000));

            client.onMessage(async (message) => {
                await notifyNewRecievedMessageCommand.execute(message, client)
            })

            newMessageConsumer
                .setHandler(async (message: { [key: string]: any }) => {
                    await sendMessageCommand.execute(message, client)
                })
                .listen()
        })
        .catch(async (erro) => {
            console.log(erro);
            process.exit(0)
        });
}

startApp();