import { Inject, Injectable } from "@nestjs/common";
import { ImageMessageDto } from "./dtos/image-message.dto";
import { MessageDto } from "./dtos/message.dto";
import { Message } from "./entities/message.entity";
import { Media } from "./entities/media.entity";
import { TypeMessage } from "../common/types/type-message";
import { DocumentMessageDto } from "./dtos/document-message.dto";
import { AudioMessageDto } from "./dtos/audio-message.dto";
import { Provider } from "../common/constants/provider";
import { StorageInterface } from "../common/adapters/storage/storage.interface";
import { ProducerInterface } from "../common/adapters/queue/producer.interface";
import { ImageMessage } from "../common/adapters/queue/messages/image-message";
import { DocumentMessage } from "../common/adapters/queue/messages/document-message";
import { VoiceMessage } from "../common/adapters/queue/messages/voice-message";
import { TextMessage } from "../common/adapters/queue/messages/text-message";
import { ParamsPublish } from "../common/adapters/queue/params-publish.interface";
import { RepositoryInterface } from "./adapters/repositories/repository.interface";
import { Exchange, RoutingKey } from "../common/constants/rabbitmq";
import { TextMessageBatchDto } from "./dtos/text-message-batch.dto";
import { BusinessException } from "../common/exceptions/business.exception";
import { InstanceService } from "../instance/instance.service";
import { ScheduleMessageDto } from "./dtos/schedule-message.dto";
import { ScheduleMessage } from "./entities/schedule-message.entity";
import { LoggerInterface } from "src/common/adapters/logger/logger.interface";

@Injectable()
export class MessageService {

    private paramsToPulishMessage: ParamsPublish = {
        exchange: Exchange.NEW_MESSAGE,
        routingKey: RoutingKey.NEW_MESSAGE
    }

    constructor(
        @Inject(Provider.MESSAGE_REPOSITORY) private repository: RepositoryInterface<Message>,
        @Inject(Provider.MEDIA_REPOSITORY) private mediaRepository: RepositoryInterface<Media>,
        @Inject(Provider.QUEUE_PRODUCER) private queueProducer: ProducerInterface,
        @Inject(Provider.STORAGE) private storage: StorageInterface,
        private instanceService: InstanceService,
        @Inject(Provider.SCHEDULE_MESSAGE_REPOSITORY) private scheduleMessageRepository: RepositoryInterface<ScheduleMessage>,
        @Inject(Provider.LOGGER) private logger: LoggerInterface
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
            media.type = typeMessage;
            media.name = fileLink;

            await this.mediaRepository.save(media)
            message.media = media;
        }

        if (messageDto.instanceId) {
            const instance = await this.instanceService.findById(messageDto.instanceId)
            message.instance = instance;
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
            this.getParamsToPublishMessage(imageMessageDto.instanceId),
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
            this.getParamsToPublishMessage(documentMessageDto.instanceId),
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
            this.getParamsToPublishMessage(audioMessageDto.instanceId),
            new VoiceMessage(
                audioMessageDto.text,
                audioMessageDto.to,
                audioMessageDto.audio
            )
        )

        return messageCreated;
    }

    async sendTextMessagesInBatch(batchMessages: TextMessageBatchDto): Promise<void> {
        if (batchMessages.messages.length > 20) {
            throw new BusinessException("The total messages you can send in batch is 20 messages.")
        }

        const messages: Message[] = [];
        const messagesToPublish: TextMessage[] = []
        for (let index = 0; index < batchMessages.messages.length; index += 1) {
            const item = batchMessages.messages[index]
            const message: Message = new Message()
            message.text = item.text;
            message.to = item.to;
            message.createdAt = new Date();
            message.updatedAt = new Date();
            message.sendedAt = new Date();
            messages.push(message);
            messagesToPublish.push(
                new TextMessage(item.text, item.to)
            )
        }

        await this.repository.saveMany(messages)
        return this.queueProducer.publishMany(
            this.paramsToPulishMessage,
            messagesToPublish
        );
    }

    async send(messageDto: MessageDto): Promise<Message> {
        const messageCreated = await this.saveMessage(
            messageDto, TypeMessage.TEXT
        )

        await this.queueProducer.publish(
            this.getParamsToPublishMessage(messageDto.instanceId),
            new TextMessage(
                messageDto.text, messageDto.to
            )
        )

        return messageCreated
    }

    async schedule(scheduleMessageDto: ScheduleMessageDto) {
        const message: Message = await this.saveMessage(
            scheduleMessageDto, TypeMessage.TEXT
        );

        const scheduleMessage = new ScheduleMessage()
        scheduleMessage.hasProcessed = false;
        scheduleMessage.scheduledAt = scheduleMessageDto.scheduledAt;
        scheduleMessage.message = message
        
        return this.scheduleMessageRepository.save(scheduleMessage)
    }

    async triggerScheduledMessages() {
        try {
            this.logger.info(`Starting process to send scheduled message`)
            const scheduleMessage = new ScheduleMessage();
            scheduleMessage.hasProcessed = false
            this.logger.info(`Getting scheduled message to send`)
            const messagesToTrigger = await this.scheduleMessageRepository.findAllByFilters(
                scheduleMessage
            );
    
            if (messagesToTrigger.length === 0) {
                this.logger.info(`Finished here because don't have scheduled message to send`)
                return;
            }
    
            const scheduleMessageIds: string[] = [];
            const messages: Message[] = [];
            for (let index = 0; index < messagesToTrigger.length; index += 1) {
                scheduleMessageIds.push(messagesToTrigger[index].id)
                messages.push(messagesToTrigger[index].message)
            }
    
            this.logger.info(`Sending scheduled message to queue`)
            let messagesToPublishPromise = [];
            for (let index = 0; index < messages.length; index += 1) {
                const message = messages[index];
            
                if (messagesToPublishPromise.length === 4) {
                    await Promise.all(messagesToPublishPromise);
                    messagesToPublishPromise = []
                }
    
                let instanceId = null;
                if (message.instance && message.instance.id) {
                    instanceId = message.instance.id
                }
    
                messagesToPublishPromise.push(
                    this.queueProducer.publish(
                        this.getParamsToPublishMessage(instanceId),
                        new TextMessage(message.text, message.to)
                    )
                )
            }
    
            if (messagesToPublishPromise.length > 0) {
                await Promise.all(messagesToPublishPromise);
                messagesToPublishPromise = []
            }
    
            this.logger.info(`Sended scheduled message to queue`)
            scheduleMessage.hasProcessed = true;
            this.logger.info(`Updating scheduled message to hasProcess equal true`)
            await this.scheduleMessageRepository.updateMany(
                scheduleMessageIds, scheduleMessage
            )
            this.logger.info(`Updated scheduled message to hasProcess equal true`)
            this.logger.info(`Finished process to send scheduled message`)
        } catch(error) {
            this.logger.error(error)
            throw error;
        }
    }

    private getParamsToPublishMessage(instanceId: string | null) {
        const paramsDefaultToPublishMessage: ParamsPublish = {
            exchange: Exchange.NEW_MESSAGE,
            routingKey: RoutingKey.NEW_MESSAGE
        }

        if (!instanceId) {
            return paramsDefaultToPublishMessage
        }

        return {
            exchange: Exchange.NEW_MESSAGE,
            routingKey: instanceId
        }
    }
}