import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { Message } from "./entities/message.entity";
import { Media } from "./entities/media.entity";
import { TypeMessage } from "src/common/types/type-message";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { AudioMessageDto } from "./dtos/audio-message.dto";
import { Provider } from "src/common/constants/provider";
import { StorageInterface } from "src/common/adapters/storage/storage.interface";
import { ProducerInterface } from "src/common/adapters/queue/producer.interface";
import { ImageMessage } from "src/common/adapters/queue/messages/image-message";
import { DocumentMessage } from "src/common/adapters/queue/messages/document-message";
import { VoiceMessage } from "src/common/adapters/queue/messages/voice-message";
import { TextMessage } from "src/common/adapters/queue/messages/text-message";
import { ParamsPublish } from "src/common/adapters/queue/params-publish.interface";

@Injectable()
export class MessageService {

    private readonly paramsToPulishMessage: ParamsPublish = {
        exchange: process.env.RABBIT_EXCHANGE_NEW_MESSAGE,
        routingKey: "new_message"
    }

    constructor(
        @InjectRepository(Message) private repository: Repository<Message>,
        @Inject(Provider.QUEUE_PRODUCER) private queueProducer: ProducerInterface,
        @Inject(Provider.STORAGE) private storage: StorageInterface,
    ) { }

    private extractBase64ContentTheBase64URL(base64URL) {
        return base64URL.split("base64,")[0]
    }

    private async saveMessage(
        messageDto: { [key: string]: any }, typeMessage: TypeMessage
    ) {
        const extractBase64TheBase64URLByTypeMessage = {
            [TypeMessage.VOICE]: messageDto.audio,
            [TypeMessage.DOCUMENT]: messageDto.document,
            [TypeMessage.IMAGE]: messageDto.image
        }

        const message: Message = new Message()
        message.text = messageDto.text;
        message.to = messageDto.to;

        if (typeMessage != TypeMessage.TEXT) {
            const base64Document = this.extractBase64ContentTheBase64URL(
                extractBase64TheBase64URLByTypeMessage[typeMessage]
            )

            const fileLink = await this.storage.upload({
                encoding: "base64",
                content: base64Document,
                filename: `${(new Date().getTime())}${messageDto.to}`,
            })

            const media: Media = new Media();
            media.type = TypeMessage.IMAGE;
            media.name = fileLink;
            message.media = media;
        }

        message.createdAt = new Date();
        message.updatedAt = new Date();
        message.sendedAt = new Date();
        return this.repository.save(message)
    }

    async sendImage(imageMessageDto: ImageMessageDto): Promise<Message> {
        const messageCreated = await this.saveMessage(
            imageMessageDto, TypeMessage.IMAGE
        )

        await this.queueProducer.publish(
            this.paramsToPulishMessage,
            new ImageMessage(
                imageMessageDto.text,
                imageMessageDto.to,
                imageMessageDto.image
            )
        )
        return messageCreated;
    }

    async sendDocument(documentMessageDto: DocumentMessageDto): Promise<Message> {
        const messageCreated = await this.saveMessage(
            documentMessageDto, TypeMessage.DOCUMENT
        )

        await this.queueProducer.publish(
            this.paramsToPulishMessage,
            new DocumentMessage(
                documentMessageDto.text,
                documentMessageDto.to,
                documentMessageDto.document
            )
        )

        return messageCreated;
    }

    async sendAudio(audioMessageDto: AudioMessageDto): Promise<Message> {
        const messageCreated = await this.saveMessage(
            audioMessageDto, TypeMessage.VOICE
        )

        await this.queueProducer.publish(
            this.paramsToPulishMessage,
            new VoiceMessage(
                audioMessageDto.text,
                audioMessageDto.to,
                audioMessageDto.audio
            )
        )

        return messageCreated;
    }

    async send(messageDto: MessageDto): Promise<Message> {
        const messageCreated = await this.saveMessage(
            messageDto, TypeMessage.TEXT
        )

        await this.queueProducer.publish(
            this.paramsToPulishMessage,
            new TextMessage(
                messageDto.text, messageDto.to
            )
        )

        return messageCreated
    }
}