import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { AuthCredentialCreateDto } from "./dtos/auth-credential-create.dto";
import { AuthCredential } from "./auth-credential.entity";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";
import { TypeAuthCredential } from "src/common/types/type-auth-credential";
import { Provider } from "src/common/constants/provider";
import { JwtAuth } from "src/common/adapters/auth/jwt-auth";
import { RepositoryInterface } from "src/security/adapters/repositories/repository.interface";

@Injectable()
export class AuthCredentialService {

    constructor(
        @Inject(Provider.AUTH_CREDENTIAL_REPOSITORY) private repository: RepositoryInterface<AuthCredential>,
        @Inject(Provider.AUTH) private jwtAuth: JwtAuth
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
        if (clientDomain != credentialReturned[0].domain) {
            throw new Error("Credential invalid.")
        }
    }

    create(data: AuthCredentialCreateDto) {
        if (
            data.type != TypeAuthCredential.API &&
            data.type != TypeAuthCredential.WEBSOCKET &&
            data.type != TypeAuthCredential.CLIENT_WEBSOCKET
        ) {
            throw new BadRequestException("Type is invalid. Type valid are: bot, api and websocket")
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
            throw new BadRequestException("Credentials invalid!")
        }

        const expirationByType = {
            [TypeAuthCredential.CLIENT_WEBSOCKET]: '1d',
            [TypeAuthCredential.WEBSOCKET]: "1d",
            [TypeAuthCredential.API]: (15 * 60)
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