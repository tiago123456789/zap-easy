import { config } from "dotenv"
config();

import * as rabbitmq from "amqplib"

const exchanges = [
    {
        name: "dead_letter_exchange", type: "fanout"
    },
    {
        name: "logout_instance", type: "direct"
    },
    {
        name: "new_message_exchange", type: "direct"
    },
    {
        name: "new_received_message_exchange", type: "fanout"
    },
    {
        name: "update_status_instance", type: "direct"
    }
];

const queues = [
    {
        routingKey: "",
        exchange: "dead_letter_exchange",
        name: "dead_letter_queue", options: {}
    },
    {
        routingKey: "new_message",
        exchange: "new_message_exchange",
        name: "new_message",
        options: {
            durable: true,
            EXCHANGE: "dead_letter_exchange",
            deadLetterExchange: 'dead_letter_exchange',
            deadLetterRoutingKey: ''
        }
    },
    {
        routingKey: "",
        exchange: "new_received_message_exchange",
        name: "new_received_message",
        options: {
            durable: true,
            EXCHANGE: "dead_letter_exchange",
            deadLetterExchange: 'dead_letter_exchange',
            deadLetterRoutingKey: ''
        }
    },
    {
        routingKey: "",
        exchange: "new_received_message_exchange",
        name: "received_message_queue_to_trigger_webhook",
        options: {
            durable: true,
            EXCHANGE: "dead_letter_exchange",
            deadLetterExchange: 'dead_letter_exchange',
            deadLetterRoutingKey: ''
        }
    },
    {
        routingKey: "update_status_routing_key",
        exchange: "update_status_instance",
        name: "update_status_instance_queue",
        options: {
            durable: true,
            EXCHANGE: "dead_letter_exchange",
            deadLetterExchange: 'dead_letter_exchange',
            deadLetterRoutingKey: ''
        }
    }
];

async function setup() {
    console.log("STARTING PROCESS TO SETUP EXCHANGES AND QUEUES THE RABBITMQ");
    const conn = await rabbitmq.connect(process.env.RABBIT_URI);

    console.log("CREATING EXCHANGES");
    const ch1 = await conn.createChannel();
    for (let index = 0; index < exchanges.length; index += 1) {
        await ch1.assertExchange(exchanges[index].name, exchanges[index].type)
    }
    console.log("CREATED EXCHANGES");

    console.log("CREATING QUEUE AND BIND QUEUE TO EXCHANGE")
    for (let index = 0; index < queues.length; index += 1) {
        const queue = queues[index];
        await ch1.assertQueue(queue.name, queue.options)
        await ch1.bindQueue(
            queue.name,
            queue.exchange,
            queue.routingKey
        )
    }
    console.log("CREATED QUEUE AND BIND QUEUE TO EXCHANGE")

    ch1.close();
    conn.close();
    console.log("FINISHED PROCESS TO SETUP EXCHANGES AND QUEUES THE RABBITMQ");
}

setup();