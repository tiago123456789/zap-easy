require("dotenv").config();
import path from "path"
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
import logger from "./utils/WinstonLogger"
import S3Storage from "./utils/S3Storage";

const sendMessageCommand = new SendMessageCommand(
    logger
);
const logoutInstanceCommand = new LogoutInstanceCommand(
    logger
);
const removeCredentialsInstance = new RemoveCredentialsInstance(
    logger
);
const updateStatusInstanceProcuder = new Producer(App.EXCHANGE_UPDATE_STATUS_INSTANCE)
const receivedMessageProducer = new Producer(App.EXCHANGE_NEW_RECEIVED_MESSAGE)
const notifyNewRecievedMessageCommand = new NotifyNewRecievedMessageCommand(
    receivedMessageProducer, logger
)
const newMessageConsumer = new Consumer(
    App.QUEUE_NEW_MESSAGE,
    App.EXCHANGE_NEW_MESSAGE,
)

const saveQrcodeCommand = new SaveQrcodeCommand(
    new S3Storage,
    logger
)
const startApp = async () => {
    try {
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

        const newMessageToInstanceConsumer = new Consumer(
            {
                ...App.QUEUE_NEW_MESSAGE,
                name: `${App.QUEUE_NEW_MESSAGE.name}_${sessionName}`
            },
            {
                ...App.EXCHANGE_NEW_MESSAGE,
                routingKey: sessionName
            }
        )

        logger.info(`Updating status to offline the instance named ${sessionName}`)
        await updateStatusInstanceProcuder.publish({
            id: sessionName,
            isOnline: false
        })
        logger.info(`Updated status to offline the instance named ${sessionName}`)

        const pathSession = (path.join(__dirname, "..", "tokens", sessionName))
        removeCredentialsInstance.execute(
            { pathSession, sessionName },
            null
        )

        create({
            headless: true,
            session: sessionName,
            useChrome: false,
            catchQR: async (base64Qrimg: string, asciiQR: string, attempt: number, urlCode?: string) => {
                logger.info(`Updating status to online the instance named ${sessionName}`)
                await updateStatusInstanceProcuder.publish({
                    id: sessionName,
                    isOnline: true
                })
                await saveQrcodeCommand.execute({
                    sessionName,
                    filename: `${sessionName}.png`,
                    content: urlCode,
                    contentType: "binary"
                }, null)
            },
        })
            .then(async (client) => {
                logoutInstanceConsumer
                    .setHandler(async (data: any) => { })
                    .setHandlerAfterAck(() => {
                        logger.info(`Starting process to logout instance named ${sessionName}`)
                        logoutInstanceCommand.execute(
                            { sessionName },
                            null
                        )
                    })
                    .listen()

                setInterval(async () => {
                    const isOnline = await client.isConnected()
                    logger.info(`Updating status the instance named ${sessionName}`)
                    await updateStatusInstanceProcuder.publish({
                        id: sessionName,
                        isOnline
                    })
                }, (60 * 1000));

                client.onMessage(async (message) => {
                    message.sessionName = sessionName;
                    await notifyNewRecievedMessageCommand.execute(message, client)
                })

                newMessageConsumer
                    .setHandler(async (message: { [key: string]: any }) => {
                        message.sessionName = sessionName;
                        await sendMessageCommand.execute(message, client)
                    })
                    .listen()

                newMessageToInstanceConsumer
                    .setHandler(async (message: { [key: string]: any }) => {
                        message.sessionName = sessionName;
                        await sendMessageCommand.execute(message, client)
                    })
                    .listen()
            })
            .catch(async (error) => {
                logger.error(error)
                process.exit(0)
            });
    } catch (error: any) {
        logger.error(error);
        throw error;
    }
}

startApp();