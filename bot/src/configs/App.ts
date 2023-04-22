export default {
    EXCHANGE_LOGOUT_INSTANCE: {
        name: "logout_instance",
        type: "direct",
        routingKey: "",
        options: {
            durable: true
        }
    },
    EXCHANGE_UPDATE_STATUS_INSTANCE: {
        name: "update_status_instance",
        type: "direct",
        routingKey: "update_status_routing_key",
        options: {
            durabl: true
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
    QUEUE_NEW_MESSAGE:  {
        name: "new_message",
        options: { durable: true }
    },
    QUEUE_LOGOUT_INSTANCE: {
        name: "logout_instance_",
        options: { durable: true }
    },
}