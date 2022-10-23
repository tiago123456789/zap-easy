Warning:
============
IF YOU NEED SEND HUGE VOLUME THE MESSAGE IN SHORT PERIOD TIME I'M RECOMMEND YOU USE **OFFICAL API**. IF YOU USE THIS PROJECT ALL RESPONSABILITIES CASE OCCOUR SOMETHING IS YOUR.

What's the project: 
====================

The ideia behind the project is help freelancer developer, developer team and small companies that need send message via What'sapp, but after analyse the the cost to use What'sapp official api behind official partner unfortunately is impossible. 

In this case you can use this project, because this project I'm create api and you can use the api to send: voice message, image message, text message or document message prevent try create all solution to send message to the whats'sapp of zero.

The bot part is implemented over **venom-bot** so this api is **UNOFFICIAL SOLUTION**. Explain how to work the bot, the bot run over venom-bot that use a headless browser to access version web of What'sapp, the venom-bot get qrcode, you scan qrcode and after scanned qrcode is create and keep one session on web What'sapp until venom-bot process die.

The bot after created session on web what'sapp can:
- Listening new messages received to notify another via wehook and websocket another application. 
- The bot get this messages to send.

The project technologies:
--------------------------

- Backend:
    - Node.js
    - Nest.js
    - Typescript
    - Socket.io(Websocket)
    - S3
- Bot:
    - Node.js
    - Typescript
    - Venom-bot
- Database:
    - Postgres
- Message queue:
    - Rabbitmq
- Another:
    - Docker

Features:
-------------------

- Send the text message.
- Send the image message.
- Send the audio message.
- Send the document message.
- Notify third application via webhook when bot receive new messages.
- Notify third application via websocket when bot recieve new messages.
- Notify third application running on browser via websocket when bot recieve new messages.
- You can the webhook url to send text message more easily.

Architecture:
---------------------

![architecture the project](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/architecture-zap-easy.drawio.png "Architecture the project")

Explanation the image above:
- User send request to the api
- The api save data in database and publish data in queue
- The bot consume message the queue and send for people
- When bot receive new message get this message and publish to the queue 
- The api has a consumer that get message and notify via webhook and another consumer that get message and notify via websocket to all clients websocket connected.
- Do you want consume new message received? But don't want implement webhook, don't want implement client websocket or you use language different of javascript only you need create queue any name and connect this queue to the exchange named "new_received_message_exchange" because this exchange type is fanout, so all queues connected in this exchange receive a same message. 

Learn more details about the architecture here: [click here](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/ARCHITECTURE.md)

Database:
---------------------

![architecture the project](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/database.drawio.png "Architecture the project")

**OBSERVATION:** the current structure of database, but can be change.

How to run the project locally:
=================================

- Backend
    - Access directory **api**
    - Execute command **npm install**
    - Create file named **.env** based **.env.example** file in root of directory **api**
    - Execute command **docker-compose up -d** to create following docker containers: postgres, pgadmin and rabbitmq
    - Execute command **npm run start:dev** to run your project
- Bot:
    - Access directory **bot**
    - Execute command **npm install**
    - Create file named **.env** based **.env.example** file in root of directory **bot**
    - Execute command **docker-compose up -d** to create following docker containers: postgres, pgadmin and rabbitmq
    - Execute command **npm run start:dev** to run your project


