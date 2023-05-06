import { Command, CommandRunner, Option } from "nest-commander"
import { InstanceService } from "./instance.service"

@Command({
  name: "instance:create",
  options: {}
})
export class InstanceCommander implements CommandRunner {

  constructor(
    private readonly instanceService: InstanceService
  ) { }

  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {
    try {
      const name = options.title;
      if (!name) {
        throw new Error("You need informe the instance name")
      }

      const instanceCreated = await this.instanceService.create(name)
      console.log("INSTANCE ID =>", instanceCreated.id)
      console.log(`COPY INSTANCE ID AND PASS WITH PARAM WHEN WILL RUN BOT. FOR EXAMPLE: pm2 start 'npm run start' --name='bot_name_here' -- --instance=${instanceCreated.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      process.exit(0)
    }
  }

  @Option({
    flags: '-t, --title <title>',
    description: `Should the command use --name or -n for specific instance name.`
  })
  parseNameOption(name: string) {
    return name;
  }

}