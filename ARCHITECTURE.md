Architecture:
===============

![architecture the project](https://github.com/tiago123456789/zap-easy/blob/feature/create-documentation/architecture-zap-easy.drawio.png "Architecture the project")


Why I splited the project between API and BOT?
=============================================

When I'm split because case necessary you can scale api vertically and horizontally, case I'm implemented api and bot together will impossible to scale horizontally and only option is scale vertically, but increase the resource of machine is limited.

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
