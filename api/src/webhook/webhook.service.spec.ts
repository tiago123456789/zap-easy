import { WebhookService } from "./webhook.service"
import { ProducerInterface } from "../common/adapters/queue/producer.interface";
import { RepositoryInterface } from "../message/adapters/repositories/repository.interface";
import { Webhook } from "./webhook.entity";
import { MessageDto } from "../message/dtos/message.dto";

describe("WehbookService", () => {
    let repository: jest.Mocked<RepositoryInterface<Webhook>>;
    let queueProducer: jest.Mocked<ProducerInterface>;
    const fakeId = '332bdfc1-605c-4bba-ac76-412f707071ac';
    const fakeKey = '332bdfc1-605c-4bba-ac76-412f707071ac';

    const fakeMessage = new MessageDto()
    fakeMessage.to = "55629851548888";
    fakeMessage.text = "Test message";

    const webhook = new Webhook()
    webhook.id = fakeId
    webhook.key = fakeKey

    beforeEach(() => {
        repository = {
            findOne: jest.fn(),
            save: jest.fn()
        };
        queueProducer = {
            publish: jest.fn(),
            publishMany: jest.fn()
        }
    })

    it("Should be create webhook url success", async () => {
        const webhook = new Webhook();
        webhook.id = "332bdfc1-605c-4bba-ac76-412f707071ac",
            webhook.key = '332bdfc1-605c-4bba-ac76-412f707071ac'
        repository.save.mockResolvedValue(webhook)
        const webhookService = new WebhookService(
            repository, queueProducer
        )

        await webhookService.create()
        expect(repository.save).toHaveBeenCalledTimes(1)
    })

    it("Should be throw exception when webhook url not found", async () => {
        try {

            const fakeMessage = new MessageDto()
            fakeMessage.to = "55629851548888";
            fakeMessage.text = "Test message";
            repository.findOne.mockResolvedValue(null)
            const webhookService = new WebhookService(
                repository, queueProducer
            )

            await webhookService.notifyByWebhook(fakeId, fakeKey, fakeMessage)
        } catch (error) {
            expect(error.message).toBe("Webhook url not found.")
        }

    })

    it("Should be throw exception when make request webhook url, but key invalid", async () => {
        try {
            repository.findOne.mockResolvedValue(webhook)
            const webhookService = new WebhookService(
                repository, queueProducer
            )

            await webhookService.notifyByWebhook(fakeId, `${fakeKey}a`, fakeMessage)
        } catch (error) {
            expect(error.message).toBe("You can't execute this action because don't have permission")
        }
    })

    it("Should be make request webhook url success", async () => {
        repository.findOne.mockResolvedValue(webhook)
        const webhookService = new WebhookService(
            repository, queueProducer
        )

        await webhookService.notifyByWebhook(fakeId, fakeKey, fakeMessage);
        expect(repository.findOne).toHaveBeenCalled()
        expect(queueProducer.publish).toHaveBeenCalled()
    })
})