import amqp from 'amqplib';
import { Exchange } from './Exchange';
import { Queue } from './Queue';

export default class Consumer {

    private handler: Function | undefined;
    private handlerAfterAck: Function | undefined;
    private exchange: string;
    private exchangeType: string
    private exchangeOptions: { [key: string]: any }
    private routingKey: string

    private queue: Queue;

    constructor(
        queue: Queue,
        exchange: Exchange,
    ) {
        this.exchange = exchange.name
        this.exchangeType = exchange.type
        this.exchangeOptions = exchange.options
        this.routingKey = exchange.routingKey
        this.queue = queue
    }

    setHandler(callback: Function) {
        this.handler = callback;
        return this;
    }

    setHandlerAfterAck(callback: Function) {
        this.handlerAfterAck = callback;
        return this;
    }

    async listen() {
        // @ts-ignore
        const connection = await amqp.connect(process.env.RABBIT_URI)
        const channel = await connection.createChannel()
        await channel.assertExchange(this.exchange, this.exchangeType, this.exchangeOptions);
        const q = await channel.assertQueue(this.queue.name, this.queue.options)
        await channel.bindQueue(q.queue, this.exchange, this.routingKey);
        channel.consume(q.queue, async (msg: any) => {
            if (msg.content) {
                try {
                    const message = JSON.parse(msg.content.toString());
                    await this.handler!(message)
                    channel.ack(msg)
                    if (this.handlerAfterAck) {
                        await this.handlerAfterAck!()
                    }
                } catch(error) {
                    channel.reject(msg, false)
                }
            }
        }, { noAck: false });
    }
}