import { AuthInterface } from "./auth.interface";
import * as jwt from "jsonwebtoken"
import { JwtService } from "@nestjs/jwt";
import { TypeAuthCredential } from "src/common/types/type-auth-credential";
import { OptionsAuth } from "./options-auth.interface";
import { Payload } from "./payload.interface";

export class JwtAuth implements AuthInterface {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    generateCredentials(params: Payload, options: OptionsAuth): string {
        return this.jwtService.sign(params, options)
    }

    isValid(token: string): Boolean {
        if (!token) {
            throw new Error("Token is invalid")
        }

        token = token.replace("Bearer ", "")
        // @ts-ignore
        const decodedPayload: Payload = jwt.verify(token, process.env.JWT_SECRET)
        if (decodedPayload.type !== TypeAuthCredential.WEBSOCKET) {
            throw new Error("Token is invalid")
        }

        return true;
    }
}