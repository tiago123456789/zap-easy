export default {
    EXCHANGE_UPDATE_STATUS_INSTANCE: {
        name: "update_status_instance",
        type: "direct",
        routingKey: "update_status_routing_key",
        options: {
            durable: true
        }
    },
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
    EXCHANGE_NEW_MESSAGE_DLQ:  {
        name: "new_message_exchange_dlq",
        type: "direct",
        routingKey: "new_message_dlq",
        options: {}
    },
    QUEUE_NEW_MESSAGE_DLQ:  {
        name: "new_message_dlq",
        options: { 
            durable: true,
        }
    },
    QUEUE_NEW_MESSAGE:  {
        name: "new_message",
        options: { 
            durable: true,
            arguments: {
                'x-dead-letter-exchange': "new_message_exchange_dlq",
                'x-dead-letter-routing-key': 'new_message_dlq',
            }
        }
    },
}