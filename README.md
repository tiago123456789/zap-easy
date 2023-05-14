# About

I created this project only improve my knowledge about Nest.js. But I was want to create one thing different that challenge me, so the result is the api allow send message to numbers in what'sapp contact list and more another features i describe below.

# Features
- Send text message.
- Send audio message.
- Send image message.
- Send document message.
- Send text message to specific instance.
- Send audo message to specific instance.
- Send image message to specific instance.
- Send document message to specific instance.
- Schedule message to send specific date.
- Send text message in batch. WARNING: you can send 20 messages.
- Get new message received what'sapp notify another applications via webhook or websocket.
- Send text message via webhook. WARNING: this feature is ease way to send text message.
- List instances(bot)
- Get instance(bot) by id
- Get qrcode the instance(bot)
- Logout instance(bot) by id

# Technologies

- Api
  - Node.js
  - Typescript
  - Nest.js
  - Postgresql(Database)
  - Storage(AWS S3)
  - Rabbitmq(Queue)
  - Socket.io(websocket)
  - Jest(for unit tests implemented api)

- Bot
  - Node.js
  - Typescript
  - Storage(AWS S3)
  - Rabbitmq(Queue)
- Others
  - Docker
  - Docker compose
  - Pm2
  - Github actions(CI pipeline)

# Database diagram

![database diagram](./documents/database.png "database diagram")


# You want learn more about the project architecture 

Link: [Learm more about architecture here](./ARCHITECTURE.md)

