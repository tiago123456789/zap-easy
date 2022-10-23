Architecture:
===============

![architecture the project](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/architecture-zap-easy.drawio.png "Architecture the project")

How to integrate your application without couple your applications with zap-easy
=================================================================================

When one person send new message the bot instance get this message and publish. The message is published to the exchange, the exchange type is fanout, so the fanout works like **pub/sub** pattern when message is published all queues subscribed on exchange receive the same message.

Case you have one application and need listen messages received, so you can one queue, connect the queue with the exchange and lastly create a consumer process to listen queue to processe the message.

The image below help you understand how to work the part:

![integrate third application with zap-easy without use websocket or webhook](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/integrate-third-application-uncouple-way.drawio.png "integrate third application with zap-easy without use websocket or webhook")


How to work the bot:
=======================

- When you start the bot process you passed with param the instance id because after create session web What'sapp time by time send message to notify the instance the bot is online.
- The api consume the message and update database if instance is online or not.
- The api receive the request to send message to specific phone number, get received data and publish on queue
- The bot has a consumer listening the queue, get a new message and the bot send message to phone number specified. Case you need handler more messages more quickly you can create one more process the bot, but now you need specific the new intance id with a param, this way you can process more message less time because now you have 2 process the bot to consume the queue and send message.

The image below help you understand how to work the bot instance:

![architecture the bot instance](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/architecture-the-bot-instance.png "architecture the bot instance")


How to work notification via webhook: 
======================================

- When any people send message to the What'sapp number the bot get a new message
- The bot publish new message to exchange named **new_received_message_exchange** and all queues conneted with this exchange receive the message
- In this case the api has a consumer waiting new message on queue, this queue is connected with the exchange named **new_received_message_exchange** so, the consumer get message and make a request for url specified sending the message.


The image below help you understand how to work the bot instance:

![architecture to notify new message via webhook](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/architecture-the-notify-via-webhook.png "architecture to notify new message via webhook")

How to work notification via websocket: 
======================================

- When any people send message to the What'sapp number the bot get a new message
- The bot publish new message to exchange named **new_received_message_exchange** and all queues conneted with this exchange receive the message
- In this case the api has a consumer waiting new message on queue, this queue is connected with the exchange named **new_received_message_exchange** so, the consumer get message and send the message via websocket to all clients conneted on websocket server.


![architecture to notify new message via websocket](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/notify-message-via-websocket-architecture.png "architecture to notify new message via websocket")


Why I splited the project between API and BOT?
=============================================

When I split because case necessary you can scale api vertically and horizontally, case I implemented api and bot together will impossible to scale horizontally and only option is scale vertically, but increase the resource of machine has limite.

Another point is the bot part is heavy beacuse using headless browser to manipulate version web of What'sapp to send message or collect the new message to notify third application. 

So, when I splited the api and bot I can deploy api one machine and deploy bot another machine this way I prevent the bot process consume all resources and make the api more slowly.

Why use these technologies?
============================
- Node.js: i'm using this technology because I have many knowledge about it, is a technology used to the Nest.js framework and the bot using venom-bot library to simplify handler What'sapp and this library is created using Node.js. 
- Nest.js: i'm using this technology because make me more productivily to create the features, Nest.js has one structure predefined, another point is Nest.js have many modules so this way i'm prevent configure all thing of zero and Nest.js have big community for me this is very important because case have one problem I found one solution only searching in Google.
- Typescript: i'm using this technology because Nest.js use typescript and i'm have a lot features like: interface, abstract class, modifier access(private, public, protected) and anothers.
- Socket.io(Websocket): i'm using the socket.io to implement realtime communication because i'm beleive when the bot receive new message is very interest notify  more quickly possible.
- S3: i'm using the s3 because i'm have followings positive points: i no need worry about disk full, s3 is safe and case you scale the api horizontally you don't have problem when use s3.
- Postgres: i'm using because i have experience, is open-source database and exist many solution to simplify and prevent you management on hand like: RDS, Aurora and others.
- Venom-bot: this library do all hard work, create a session via web What'sapp, allow you send message, listen new message and other helpful features
- Rabbitmq: i'm using because is open-source solution this way I can prevent stay locked a cldud provider, the rabbimq(version >= 3.7.0) allow me send message with size until 2GB it's very important for me because when bot receive media message(Media message is document, audio, video and image. The size limit of media message What'sapp is 16GB per message) and need publish this message into to the queue and the rabbitmq allow me work with pub/sub pattern when i'm using the fanout exchange.
- Docker: help running postgres, rabbitmq and pgadmin without install nothing on machine.

Why the notification via webhook?
===========================================

When I starting to create the project I thinking how to notify third application when bot receive new message, i remember how the payment system notify the payment process status their using webhook to notify third application, for me this make sense because imagine for each client the payment system create a new code for connect third application of the client it's a huge problem keep this code. So I defined one way the project notify third application is via webhook.

The webhook some positive points:
- Your application no add new code to connect with third application
- You prevent third application make request for your application. Imagine the payment system, the payment system have a lot client if each third application make request time by time for check each payment if status payment change, this generate overload unnecessary.
- You simplify the client life because no necessary create code to make request time by time to get the bot new messages received.


Why the notification via websocket?
===========================================

When I starting to create the project I thinking how to notify third application when bot receive new message, but i have one more challenge how to notify realtime because imagine you creating a chat solution to help the company serves all clients that send a message for the company What'sapp.

In this case come ideia to use websocket because i need realtime communication and 
notify all clients websocket connected.




