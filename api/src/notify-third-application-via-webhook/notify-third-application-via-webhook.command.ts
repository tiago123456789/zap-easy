import { Command, CommandRunner, Option } from "nest-commander"
import { NotifyThirdApplicationViaWebhookService } from "./notify-third-application-via-webhook.service";

@Command({
    name: "webhook-notification:create",
    options: {}
  })
export class NotifyThirdApplicationViaWebhookCommand implements CommandRunner {

  constructor(
    private readonly notifyThirdApplicationViaWebhookService : NotifyThirdApplicationViaWebhookService
  ) {}

  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {
    try {
      if (!options.url) {
        throw new Error(`You need specific url.`)
      }

      const url: string = options.url
      const webhookNotification = await this.notifyThirdApplicationViaWebhookService.create(
        url
      )

      console.log("VALIDATION KEY =>", webhookNotification.key)
      console.warn("WARNING: WHEN INCOME NEW MESSAGE THE APPLICATION GET MESSAGE AND NOTIFY URL YOU INFORMED AND ADD VALIDATION WITH QUERYSTRING. FOR EXAMPLE: http://mydomain.com.br/receive-webhook-notificaton-url?key=value_validation_key_here AND YOUR APPLICATION YOU USE VALIDATION KEY TO CHECK IF REQUEST MADE PER THIS APPLICATION, NO ANOTHER PEOPLE ")
    } catch(error) {
      console.error("ERROR:", error.message)
    } finally {
      process.exit(0)
    }
    
  }

  @Option({
      flags: '-u, --url <url>',
      description: `Should the command use -u or --url to specific url to send notification with data message when income new message what'sapp bot`
    })
    parseColorOption(option: string) {
      return option;
    }

  }