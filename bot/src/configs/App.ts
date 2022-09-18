export default {
    EXCHANGE_NEW_RECEIVED_MESSAGE:  {
        name: "new_received_message_exchange",
        type: "fanout",
        routingKey: "",
        options: {}
    },
    EXCHANGE_NEW_MESSAGE:  {
        name: "new_message_exchange",
        type: "direct",
        routingKey: "new_message",
        options: {}
    },
    QUEUE_NEW_MESSAGE:  {
        name: "new_message",
        options: { durable: true }
    }
}