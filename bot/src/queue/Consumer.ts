import amqp from 'amqplib';
import { Exchange } from './Exchange';

export default class Consumer {

    private handler: Function;
    private exchange: string;
    private exchangeType: string
    private exchangeOptions: { [key: string]: any }
    private routingKey: string

    constructor(
        exchange: Exchange,
        handler: Function
    ) {
        this.exchange = exchange.name
        this.exchangeType = exchange.type
        this.exchangeOptions = exchange.options
        this.routingKey = exchange.routingKey
        this.handler = handler
    }

    async listen() {
        // @ts-ignore
        const connection = await amqp.connect(process.env.RABBIT_URI)
        const channel = await connection.createChannel()
        await channel.assertExchange(this.exchange, this.exchangeType, this.exchangeOptions);
        const q = await channel.assertQueue('', { exclusive: true })
        await channel.bindQueue(q.queue, this.exchange, this.routingKey);
        channel.consume(q.queue, async (msg: any) => {
            if (msg.content) {
                const message = JSON.parse(msg.content.toString());
                await this.handler(message)
            }
        });
    }
}