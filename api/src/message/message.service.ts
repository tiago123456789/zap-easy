import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectS3, S3 } from "nestjs-s3";
import { Repository } from "typeorm";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { Message } from "./entities/message.entity";
import { Media } from "./entities/media.entity";
import { TypeMessage } from "src/common/types/type-message";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { AudioMessageDto } from "./dtos/audio-message.dto";

@Injectable()
export class MessageService {

    constructor(
        @InjectRepository(Message) private repository: Repository<Message>,
        private readonly amqpConnection: AmqpConnection,
        @InjectS3() private readonly s3: S3,
    ) {}
    
    async sendImage(imageMessageDto: ImageMessageDto) {
        const image = imageMessageDto.image.split("base64,")[0]
        const { Location: fileLink } = await this.s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key: `${(new Date().getTime())}${imageMessageDto.to}`,
            Body: image,
            ContentEncoding: "base64"
        }).promise();

        const media: Media = new Media();
        media.type = TypeMessage.IMAGE;
        media.name = fileLink;

        const message: Message = new Message()
        message.text = imageMessageDto.text;
        message.to = imageMessageDto.to;
        message.media = media;
        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        const messageCreated = this.repository.save(message)

        await this.amqpConnection.publish(
            process.env.RABBIT_EXCHANGE_NEW_MESSAGE, 
            "new_message", 
            { type: TypeMessage.IMAGE, ...imageMessageDto }
        )
        return messageCreated;
    }

    async sendDocument(documentMessageDto: DocumentMessageDto) {
        const document = documentMessageDto.document.split("base64,")[0]
        const { Location: fileLink } = await this.s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key: `${(new Date().getTime())}${documentMessageDto.to}`,
            Body: document,
            ContentEncoding: "base64"
        }).promise();

        const media: Media = new Media();
        media.type = TypeMessage.DOCUMENT;
        media.name = fileLink;

        const message: Message = new Message()
        message.text = documentMessageDto.text;
        message.to = documentMessageDto.to;
        message.media = media;
        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        const messageCreated = this.repository.save(message)

        await this.amqpConnection.publish(
            process.env.RABBIT_EXCHANGE_NEW_MESSAGE, 
            "new_message", 
            { type: TypeMessage.DOCUMENT, ...documentMessageDto }
        )
        return messageCreated;
    }
    
    async sendAudio(audioMessageDto: AudioMessageDto) {
        const audio = audioMessageDto.audio.split("base64,")[0]
        const { Location: fileLink } = await this.s3.upload({
            Bucket: process.env.S3_BUCKET,
            Key: `${(new Date().getTime())}${audioMessageDto.to}`,
            Body: audio,
            ContentEncoding: "base64"
        }).promise();

        const media: Media = new Media();
        media.type = TypeMessage.VOICE;
        media.name = fileLink;

        const message: Message = new Message()
        message.text = audioMessageDto.text;
        message.to = audioMessageDto.to;
        message.media = media;
        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        const messageCreated = this.repository.save(message)

        await this.amqpConnection.publish(
            process.env.RABBIT_EXCHANGE_NEW_MESSAGE, 
            "new_message", 
            { type: TypeMessage.VOICE, ...audioMessageDto }
        )
        return messageCreated;
    }

    async send(messageDto: MessageDto) {
        const message: Message = new Message()
        message.text = messageDto.text;
        message.to = messageDto.to;
        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        const messageCreated = this.repository.save(message)
        await this.amqpConnection.publish(
            process.env.RABBIT_EXCHANGE_NEW_MESSAGE, 
            "new_message", 
            { type: TypeMessage.TEXT, ...messageDto }
        )

        return messageCreated
    }

    

}