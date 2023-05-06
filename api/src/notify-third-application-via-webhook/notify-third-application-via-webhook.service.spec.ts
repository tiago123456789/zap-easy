import { Webhook } from "src/webhook/webhook.entity"
import { HttpClientInterface } from "./adapters/http-client/http-client.interface"
import { RepositoryInterface } from "./adapters/repositories/repository.interface"
import { NotifyThirdApplicationViaWebhook } from "./notify-third-application-via-webhook.entity"
import { NotifyThirdApplicationViaWebhookService } from "./notify-third-application-via-webhook.service"
import { LoggerInterface } from "src/common/adapters/logger/logger.interface"

describe("NotifyThirdApplicationViaWebhookService", () => {
  let repository: jest.Mocked<RepositoryInterface<NotifyThirdApplicationViaWebhook>>;
  let httpClient: jest.Mocked<HttpClientInterface>;
  let logger: jest.Mocked<LoggerInterface>;


  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn()
    }
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
      count: jest.fn()
    };

    httpClient = {
      post: jest.fn()
    }
  })

  it(
    "Should be throw exception when create new webhook url but already exist webhook url",
    async () => {
      try {
        const notifyThirdApplicationViaWebhookService = new NotifyThirdApplicationViaWebhookService(
          repository, httpClient,
          logger
        )

        const fakeUrl = "http://example.com.br"
        repository.count.mockResolvedValue(1)
        await notifyThirdApplicationViaWebhookService.create(fakeUrl);
      } catch (error) {
        expect(error.message).toBe("Already exist webhook registered, so you can't register new webhook. Tip: access your database to change url to wish value.")
      }
    })

  it(
    "Should be create new webhook url success",
    async () => {
      const notifyThirdApplicationViaWebhookService = new NotifyThirdApplicationViaWebhookService(
        repository, httpClient, logger
      )

      const fakeUrl = "http://example.com.br"
      repository.count.mockResolvedValue(0)
      await notifyThirdApplicationViaWebhookService.create(fakeUrl);
      expect(repository.save).toHaveBeenCalled()
    })

  it(
    "Should be throw exception when try notify via webhook url, but webhook is not created",
    async () => {
      try {
        const notifyThirdApplicationViaWebhookService = new NotifyThirdApplicationViaWebhookService(
          repository, httpClient, logger
        )

        repository.findOne.mockResolvedValue(null)
        await notifyThirdApplicationViaWebhookService.notifyNewReceivedMessage({});
      } catch (error) {
        expect(error.message).toBe("You need configure webhook url to receive notification the new message")
      }
    })

  it(
    "Should be notify via webhook url success",
    async () => {
        const notifyThird = new NotifyThirdApplicationViaWebhook()
        notifyThird.url = "http://example.com.br"
        notifyThird.key = '332bdfc1-605c-4bba-ac76-412f707071ac';

        const notifyThirdApplicationViaWebhookService = new NotifyThirdApplicationViaWebhookService(
          repository, httpClient, logger
        )

        repository.findOne.mockResolvedValue(notifyThird)
        await notifyThirdApplicationViaWebhookService.notifyNewReceivedMessage({});
        expect(httpClient.post).toBeCalled()
    })
})