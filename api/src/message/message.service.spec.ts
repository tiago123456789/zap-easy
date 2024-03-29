import { ProducerInterface } from "src/common/adapters/queue/producer.interface"
import { RepositoryInterface } from "./adapters/repositories/repository.interface"
import { RepositoryInterface as InstanceRepositoryInteface }
    from "../instance/adapters/repositories/repository.interface"

import { Media } from "./entities/media.entity"
import { Message } from "./entities/message.entity"
import { MessageService } from "./message.service"
import { StorageInterface } from "../common/adapters/storage/storage.interface"
import { InstanceService } from "../instance/instance.service"
import { Instance } from "../instance/instance.entity"
import { ScheduleMessage } from "./entities/schedule-message.entity"
import { LoggerInterface } from "src/common/adapters/logger/logger.interface"

describe("MessageService", () => {
    let repository: jest.Mocked<RepositoryInterface<Message>>;
    let scheduleMessageRepository: jest.Mocked<RepositoryInterface<ScheduleMessage>>;
    let mediaRepository: jest.Mocked<RepositoryInterface<Media>>;
    let queueProducer: jest.Mocked<ProducerInterface>;
    let storage: jest.Mocked<StorageInterface>;
    let instanceRepository: jest.Mocked<InstanceRepositoryInteface<Instance>>;
    let logger: jest.Mocked<LoggerInterface>;

    let instanceService: InstanceService;
    const instance = new Instance();
    instance.id = 'b5847af0-74ed-416a-a85c-c20a804031fa';
    instance.isOnline = true;
    instance.name = "Fake instance";
    instance.updatedAt = new Date();
    instance.createdAt = new Date();


    const fakeMessage = new Message();
    fakeMessage.id = 'dd7c4065-98ac-4173-baf1-612e0989be3d'
    fakeMessage.media = null
    fakeMessage.createdAt = new Date();
    fakeMessage.updatedAt = new Date();
    fakeMessage.sendedAt = new Date();
    fakeMessage.text = "fake message";
    fakeMessage.to = '5562911111111'

    const fakeScheduleMessage = new ScheduleMessage()
    fakeScheduleMessage.hasProcessed = false;
    fakeScheduleMessage.scheduledAt = new Date();
    fakeScheduleMessage.id = 'dd7c4065-98ac-4173-baf1-612e0989be3d';
    fakeScheduleMessage.message = fakeMessage

    beforeEach(() => {
        logger = {
            info: jest.fn(),
            error: jest.fn()
        }
        instanceRepository = {
            save: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn()
        };
        repository = {
            findAllByFilters: jest.fn(),
            updateMany: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn()
        };
        scheduleMessageRepository = {
            findAllByFilters: jest.fn(),
            updateMany: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn()
        }
        mediaRepository = {
            findAllByFilters: jest.fn(),
            updateMany: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn()
        };
        queueProducer = {
            publish: jest.fn(),
            publishMany: jest.fn()
        };
        storage = {
            upload: jest.fn(),
            getLink: jest.fn()
        };
        instanceService = new InstanceService(
            instanceRepository,
            storage,
            queueProducer,
            logger
        );
    })

    it("Should be send text message success", async () => {

        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        await messageService.send({
            to: "556185615483",
            text: "Fake message"
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(0)
    })

    it("Should be send text message to specific instance success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        instanceRepository.findById.mockResolvedValue(instance)
        await messageService.send({
            to: "556185615483",
            text: "Fake message",
            instanceId: instance.id
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(instanceRepository.findById).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(0)
    })

    it("Should be send image message success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        await messageService.sendImage({
            to: "556185615483",
            text: "Fake message",
            image: "",
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send image message to specific instance success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        instanceRepository.findById.mockResolvedValue(instance)
        await messageService.sendImage({
            to: "556185615483",
            text: "Fake message",
            image: "",
            instanceId: instance.id
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(instanceRepository.findById).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send audio message success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        await messageService.sendAudio({
            to: "556185615483",
            text: "Fake message",
            audio: "",
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send audio message to specific instance success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        instanceRepository.findById.mockResolvedValue(instance)
        await messageService.sendAudio({
            to: "556185615483",
            text: "Fake message",
            audio: "",
            instanceId: instance.id
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(instanceRepository.findById).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send document message success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )


        await messageService.sendDocument({
            to: "556185615483",
            text: "Fake message",
            document: ""
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send document message to specific instance success", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        instanceRepository.findById.mockResolvedValue(instance)
        await messageService.sendDocument({
            to: "556185615483",
            text: "Fake message",
            document: "",
            instanceId: instance.id
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(instanceRepository.findById).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be throw exception when try send more than 20 messages in batch", async () => {
        try {
            const messageService = new MessageService(
                repository,
                mediaRepository,
                queueProducer,
                storage,
                instanceService,
                scheduleMessageRepository,
                logger
            )

            await messageService.sendTextMessagesInBatch({
                messages: Array(30).fill({
                    to: "556185615483",
                    text: "Fake message"
                })
            });
        } catch (error) {
            expect(error.message).toBe("The total messages you can send in batch is 20 messages.")
        }

    })

    it("Should be throw exception when try send more than 20 messages in batch", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        await messageService.sendTextMessagesInBatch({
            messages: Array(10).fill({
                to: "556185615483",
                text: "Fake message"
            })
        });

        expect(repository.saveMany).toBeCalled()
        expect(queueProducer.publishMany).toBeCalled()
    })

    it("Should be trigger scheduled message, but send nothing because don't have message to send", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        )

        scheduleMessageRepository.findAllByFilters.mockResolvedValue([])
        await messageService.triggerScheduledMessages();

        expect(scheduleMessageRepository.findAllByFilters).toBeCalled()
        expect(queueProducer.publish).toBeCalledTimes(0)
        expect(scheduleMessageRepository.updateMany).toBeCalledTimes(0)
    })

    it("Should be trigger a scheduled message, because have 1 message to trigger", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        );

        scheduleMessageRepository.findAllByFilters.mockResolvedValue([
            fakeScheduleMessage
        ])
        await messageService.triggerScheduledMessages();

        expect(scheduleMessageRepository.findAllByFilters).toBeCalled()
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(scheduleMessageRepository.updateMany).toBeCalledTimes(1)
    })

    it("Should be trigger a scheduled message, because have 2 message to trigger", async () => {
        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage,
            instanceService,
            scheduleMessageRepository,
            logger
        );

        scheduleMessageRepository.findAllByFilters.mockResolvedValue([
            fakeScheduleMessage, fakeScheduleMessage
        ])
        await messageService.triggerScheduledMessages();

        expect(scheduleMessageRepository.findAllByFilters).toBeCalled()
        expect(queueProducer.publish).toBeCalledTimes(2)
        expect(scheduleMessageRepository.updateMany).toBeCalledTimes(1)
    })
})