import amqp from 'amqplib';
import { Exchange } from './Exchange';
import { Queue } from './Queue';

export default class Producer {

    private exchange: string;
    private exchangeType: string
    private exchangeOptions: { [key: string]: any }
    private routingKey: string

    constructor(
        exchange: Exchange,
    ) {
        this.exchange = exchange.name
        this.exchangeType = exchange.type
        this.exchangeOptions = exchange.options
        this.routingKey = exchange.routingKey
    }

    async publish(data: { [key: string]: any }) {
        // @ts-ignore
        const connection = await amqp.connect(process.env.RABBIT_URI)
        const channel = await connection.createChannel();
        await channel.assertExchange(
            this.exchange, this.exchangeType, this.exchangeOptions
        );
        return channel.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)));
    }
}