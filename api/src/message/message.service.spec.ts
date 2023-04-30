import { ProducerInterface } from "src/common/adapters/queue/producer.interface"
import { RepositoryInterface } from "./adapters/repositories/repository.interface"
import { Media } from "./entities/media.entity"
import { Message } from "./entities/message.entity"
import { MessageService } from "./message.service"
import { StorageInterface } from "src/common/adapters/storage/storage.interface"

describe("MessageService", () => {
    let repository: jest.Mocked<RepositoryInterface<Message>>;
    let mediaRepository: jest.Mocked<RepositoryInterface<Media>>;
    let queueProducer: jest.Mocked<ProducerInterface>;
    let storage: jest.Mocked<StorageInterface>;

    beforeEach(() => {
        repository = {
            findOne: jest.fn(),
            save: jest.fn(),
            saveMany: jest.fn()
        };
        mediaRepository = {
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
        }
    })

    it("Should be send text message success", async () => {


        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage
        )

        await messageService.send({
            to: "556185615483",
            text: "Fake message"
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(0)
    })

    it("Should be send image message success", async () => {


        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage
        )

        await messageService.sendImage({
            to: "556185615483",
            text: "Fake message",
            image: ""
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })


    it("Should be send audio message success", async () => {


        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage
        )

        await messageService.sendAudio({
            to: "556185615483",
            text: "Fake message",
            audio: ""
        });

        expect(repository.save).toBeCalledTimes(1)
        expect(queueProducer.publish).toBeCalledTimes(1)
        expect(mediaRepository.save).toBeCalledTimes(1)
        expect(storage.upload).toBeCalledTimes(1)
    })

    it("Should be send document message success", async () => {


        const messageService = new MessageService(
            repository,
            mediaRepository,
            queueProducer,
            storage
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

    it("Should be throw exception when try send more than 20 messages in batch", async () => {
        try {
            const messageService = new MessageService(
                repository,
                mediaRepository,
                queueProducer,
                storage
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
            storage
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
})