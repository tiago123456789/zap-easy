
export const enum Exchange {
    UPDATE_STATUS = "update_status_instance",
    NEW_MESSAGE = "new_message",
    NEW_RECEIVED_MESSAGE = "new_received_message_exchange"
}

export const enum RoutingKey {
    UPDATE_STATUS = 'update_status_routing_key',
    NEW_MESSAGE = "new_message",
    NEW_RECEIVED_MESSAGE = ""
}

export const enum Queue {
    UPDATE_STATUS = 'update_status_instance_queue',
    RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK = "received_message_queue_to_trigger_webhook",
    NEW_RECEIVED_MESSAGE_EXCHANGE = "new_received_message_exchange"
}

export const enum ExchangeType {
    DIRECT = "direct",
    FANOUT = "fanout",
}