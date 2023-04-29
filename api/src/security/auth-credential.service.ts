import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AuthCredentialCreateDto } from "./dtos/auth-credential-create.dto";
import { AuthCredential } from "./auth-credential.entity";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";
import { TypeAuthCredential } from "../common/types/type-auth-credential";
import { Provider } from "../common/constants/provider";
import { RepositoryInterface } from "../security/adapters/repositories/repository.interface";
import { AuthInterface } from "../common/adapters/auth/auth.interface";
import { InvalidDataException } from "../common/exceptions/invalid-data.exception";

@Injectable()
export class AuthCredentialService {

    constructor(
        @Inject(Provider.AUTH_CREDENTIAL_REPOSITORY) private repository: RepositoryInterface<AuthCredential>,
        @Inject(Provider.AUTH) private jwtAuth: AuthInterface
    ) { }

    hasJwtTokenValid(token) {
        return this.jwtAuth.isValid(token)
    }

    async authenticateClientWebsocket(clientId: string, clientDomain) {
        const credentialReturned: AuthCredential = await this.repository
            .findByClientId(clientId);

        if (!credentialReturned) {
            throw new Error("Credential invalid.")
        }

        clientDomain = clientDomain.replace(/(http:\/\/|https:\/\/)/, "")
        clientDomain = clientDomain.replace(/:([0-9])+/, "")
        if (clientDomain != credentialReturned.domain) {
            throw new Error("Credential invalid.")
        }
    }

    create(data: AuthCredentialCreateDto) {
        if (
            data.type != TypeAuthCredential.API &&
            data.type != TypeAuthCredential.WEBSOCKET &&
            data.type != TypeAuthCredential.CLIENT_WEBSOCKET
        ) {
            throw new BadRequestException("Type is invalid. Type valid are: client websocket, api and websocket")
        }

        const newCredential = new AuthCredential();
        newCredential.type = data.type
        newCredential.domain = data.domain

        return this.repository.save(newCredential)
    }

    async authenticate(credential: AuthCredentialDto) {
        const credentialReturned: AuthCredential[] = await this.repository.findByFields({
            clientId: credential.clientId,
            clientSecret: credential.clientSecret
        })

        if (credentialReturned.length == 0) {
            throw new InvalidDataException("Credentials invalid!")
        }

        const expirationByType = {
            [TypeAuthCredential.CLIENT_WEBSOCKET]: '1d',
            [TypeAuthCredential.WEBSOCKET]: "1d",
            [TypeAuthCredential.API]: (60 * 60)
        }
        const type = credentialReturned[0].type
        return this.jwtAuth.generateCredentials(
            {
                type
            },
            {
                expiresIn: expirationByType[type]
            }
        )
    }
}