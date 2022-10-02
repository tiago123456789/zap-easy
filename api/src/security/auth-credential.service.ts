import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthCredentialCreateDto } from "./dtos/auth-credential-create.dto";
import { AuthCredential } from "./auth-credential.entity";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";
import { JwtService } from "@nestjs/jwt";
import { TypeAuthCredential } from "src/common/types/type-auth-credential";
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthCredentialService {

    constructor(
        @InjectRepository(AuthCredential) private repository: Repository<AuthCredential>,
        private readonly jwtService: JwtService
    ) {}

    hasJwtTokenValid(token) {
        if (!token) {
            throw new Error("Token is invalid")
        }

        token = token.replace("Bearer ", "")
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)
        // @ts-ignore
        if (decodedPayload.type !== TypeAuthCredential.WEBSOCKET) {
            throw new Error("Token is invalid")
        }

        return true;
    }

    async authenticateClientWebsocket(clientId: string, clientDomain) {
        const credentialReturned: AuthCredential = await this.repository.findOne({
            where: {
                clientId: clientId,
            }
        })

        if (!credentialReturned)  {
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
        const credentialReturned: AuthCredential[] = await this.repository.find({
            where: {
                clientId: credential.clientId,
                clientSecret: credential.clientSecret
            }
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
        return this.jwtService.sign({ type }, { expiresIn: expirationByType[type] })
    }
}