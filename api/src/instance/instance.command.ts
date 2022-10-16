import { Command, CommandRunner } from "nest-commander"
import { InstanceService } from "./instance.service"

@Command({
    name: "instance:create",
    options: {}
  })
export class InstanceCommander implements CommandRunner {

  constructor(
    private readonly instanceService: InstanceService
  ) {}

  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {
    try {
      const instanceCreated = await this.instanceService.create()    
      console.log("INSTANCE ID =>", instanceCreated.id)
      console.log(`COPY INSTANCE ID AND PASS WITH PARAM WHEN WILL RUN BOT. FOR EXAMPLE: pm2 start 'npm run start' --name='bot_name_here' -- --instance=${instanceCreated.id}`)
    } catch(error) {
      console.log(error)
    } finally {
      process.exit(0)
    }
  }

  }