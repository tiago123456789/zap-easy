export default {
    UPDATE_STATUS_INSTANCE_DLQ: {
        EXCHANGE: 'update_status_instance_dlq',
        TYPE: "direct",
        ROUTING_KEY: 'update_status_routing_key_dlq',
        QUEUE: 'update_status_instance_queue_dlq',
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    UPDATE_STATUS_INSTANCE: {
        EXCHANGE: 'update_status_instance',
        ROUTING_KEY: 'update_status_routing_key',
        TYPE: "direct",
        QUEUE: 'update_status_instance_queue',
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    NEW_MESSAGE: {
        EXCHANGE: 'new_message_exchange',
        TYPE: 'direct',
        ROUTING_KEY: 'new_message',
        QUEUE: 'new_message',
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    NEW_RECEIVED_MESSAGE: {
        EXCHANGE: 'new_received_message_exchange',
        TYPE: 'fanout',
        ROUTING_KEY: "",
        QUEUE_OPTIONS: {}
    },
    RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET_DLQ: {
        EXCHANGE: 'new_received_message_exchange_websocket_dlq',
        TYPE: 'direct',
        ROUTING_KEY: "new_received_message_websocket_routing_key_dlq",
        QUEUE: "received_message_queue_to_trigger_websocket_dlq",
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBSOCKET: {
        EXCHANGE: 'new_received_message_exchange',
        TYPE: 'fanout',
        ROUTING_KEY: "",
        QUEUE: "received_message_queue_to_trigger_websocket",
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK_DLQ: {
        EXCHANGE: 'new_received_message_exchange_webhook_dlq',
        TYPE: 'direct',
        ROUTING_KEY: "new_received_message_webhook_routing_key_dlq",
        QUEUE: "received_message_queue_to_trigger_webhook_dlq",
        QUEUE_OPTIONS: {
            durable: true
        }
    },
    RECEIVED_MESSAGE_QUEUE_TO_TRIGGER_WEBHOOK: {
        EXCHANGE: 'new_received_message_exchange',
        TYPE: 'fanout',
        ROUTING_KEY: "",
        QUEUE: "received_message_queue_to_trigger_webhook",
        QUEUE_OPTIONS: {
            durable: true
        }
    }
}

