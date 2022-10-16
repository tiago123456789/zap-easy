import { Command, CommandRunner, Option } from "nest-commander"
import { TypeAuthCredential } from "src/common/types/type-auth-credential"
import { AuthCredentialService } from "./auth-credential.service"

@Command({
    name: "auth:create",
    options: { }
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
      if (
        type != TypeAuthCredential.WEBSOCKET &&
        type != TypeAuthCredential.API &&
        type != TypeAuthCredential.CLIENT_WEBSOCKET
        ) {
        throw new Error(`You need specific type valid. Type valid are: ${TypeAuthCredential.WEBSOCKET}, ${TypeAuthCredential.API}`)
      }

      if (type == TypeAuthCredential.CLIENT_WEBSOCKET && !options.origin) {
        throw new Error(`You need specific domain when set type valid are: ${TypeAuthCredential.CLIENT_WEBSOCKET}. FOR EXAMPLE: ./dist/main-command --type=client_websocket --domain=localhost:3000`)
      }

      const credentials = await this.authCredentialService.create({
        type, domain: options.origin
      })

      console.log("CLIENT_ID =>", credentials.clientId)
      console.log("CLIENT_SECRET =>", credentials.clientSecret)
      console.warn("WARNING: COPY CLIENT_ID AND CLIENT_SECRET BECAUSE IS NECESSARY TO GENERATE TOKEN JWT. STORE CLIENT_ID AND CLIENT_SECRET LOCAL SAFE.")
      console.warn("WARNING: CASE YOUR SET TYPE EQUAL 'client_websocket' YOU NEED ONLY COPY CLIENT_ID. THIS TYPE IS MORE SUITABLE FOR CREATE BROWSER CLIENT WEBSOCKET CONNECTION.")

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
    parseTypeOption(option: string) {
      return option;
    }

    @Option({
      defaultValue: null,
      flags: '-o, --origin <origin>',
      description: `Should the command use --origin or -o for specific what\'s domain allow to client websocket authenticated
      using CLIENT_ID`
    })
    parseOriginOption(option: string) {
      return option;
    }

  }