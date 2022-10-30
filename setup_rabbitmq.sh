#!/bin/bash

USER_PASSWORD="username_rabbitmq_here:password_rabbitmq_here"
BASE_API_URL_RABBITMQ="http://localhost:15672"

############## CREATE EXCHANGES ################

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/update_status_instance

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/new_message_exchange

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"fanout","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/new_received_message_exchange


####### CREATE DEAD LETTER QUEUE EXCHANGES #######

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{ "type":"direct", "durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/update_status_instance_exchange_dlq

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{ "type":"direct", "durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/new_message_exchange_dlq

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{ "type":"direct", "durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/new_received_message_exchange_websocket_dlq


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{ "type":"direct", "durable":true }' \
    $BASE_API_URL_RABBITMQ/api/exchanges/%2F/new_received_message_exchange_webhook_dlq


############### CREATE QUEUES ##################

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true, "arguments":{"x-dead-letter-exchange":"update_status_instance_exchange_dlq", "x-dead-letter-routing-key": "update_status_routing_key_dlq"}}' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/update_status_instance_queue


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true, "arguments":{"x-dead-letter-exchange":"new_message_exchange_dlq", "x-dead-letter-routing-key": "new_message_dlq"}}' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/new_message


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true, "arguments":{"x-dead-letter-exchange":"new_received_message_exchange_websocket_dlq", "x-dead-letter-routing-key": "new_received_message_websocket_routing_key_dlq"}}' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/received_message_queue_to_trigger_websocket


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true, "arguments":{"x-dead-letter-exchange":"new_received_message_exchange_webhook_dlq", "x-dead-letter-routing-key": "new_received_message_webhook_routing_key_dlq"}}' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/received_message_queue_to_trigger_webhook


############### CREATE DEAD LETTER QUEUES ##################

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/update_status_instance_queue_dlq


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/received_message_queue_to_trigger_websocket_dlq


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/received_message_queue_to_trigger_webhook_dlq


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPUT -d'{"type":"direct","durable":true }' \
    $BASE_API_URL_RABBITMQ/api/queues/%2F/new_message_dlq


#### BIND EXCHANGE WITH QUEUE #######

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"update_status_routing_key","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/update_status_instance/q/update_status_instance_queue


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_received_message_exchange/q/received_message_queue_to_trigger_websocket


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_received_message_exchange/q/received_message_queue_to_trigger_webhook


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"new_message","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_message_exchange/q/new_message

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"update_status_routing_key_dlq","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/update_status_instance_exchange_dlq/q/update_status_instance_queue_dlq

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"new_received_message_websocket_routing_key_dlq","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_received_message_exchange_websocket_dlq/q/received_message_queue_to_trigger_websocket_dlq


curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"new_received_message_webhook_routing_key_dlq","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_received_message_exchange_webhook_dlq/q/received_message_queue_to_trigger_webhook_dlq

curl -i -u $USER_PASSWORD -H "content-type:application/json" \
    -XPOST -d'{"routing_key":"new_message_dlq","arguments":{}}' \
    $BASE_API_URL_RABBITMQ/api/bindings/%2f/e/new_message_exchange_dlq/q/new_message_dlq








