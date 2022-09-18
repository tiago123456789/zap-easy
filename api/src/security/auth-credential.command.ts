import { Command, CommandRunner, Option } from "nest-commander"
import { TypeAuthCredential } from "src/common/types/type-auth-credential"
import { AuthCredentialService } from "./auth-credential.service"

@Command({
    name: "auth:create",
    options: {}
  })
export class AuthCredentialCommander implements CommandRunner {

  constructor(
    private readonly authCredentialService: AuthCredentialService
  ) {}

  async run(
    inputs: string[],
    options: Record<string, any>
  ): Promise<void> {
    try {
      const type = options.type
      if (type != TypeAuthCredential.WEBSOCKET && type != TypeAuthCredential.API) {
        throw new Error(`You need specific type valid. Type valid are: ${TypeAuthCredential.WEBSOCKET}, ${TypeAuthCredential.API}`)
      }

      const credentials = await this.authCredentialService.create({
        type
      })

      console.log("CLIENT_ID =>", credentials.clientId)
      console.log("CLIENT_SECRET =>", credentials.clientSecret)
      console.warn("WARNING: COPY CLIENT_ID AND CLIENT_SECRET BECAUSE IS NECESSARY TO GENERATE TOKEN JWT. STORE CLIENT_ID AND CLIENT_SECRET LOCAL SAFE.")
    } catch(error) {
      console.log(error.message)
    } finally {
      process.exit(0)
    }
    
  }

  @Option({
      flags: '-t, --type <type>',
      description: `Should the command use --type or -t for specific what\'s type 
      to create auth credentials. Type is responsible define time expiration the token jwt. 
      For example: type equal 'api' expiration time 15 minutes and type equal 'websocket' expiration time 1 day.`
    })
    parseColorOption(option: string) {
      return option;
    }

  }