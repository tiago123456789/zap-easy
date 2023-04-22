import { AuthInterface } from "./auth.interface";
import * as jwt from "jsonwebtoken"
import { JwtService } from "@nestjs/jwt";
import { OptionsAuth } from "./options-auth.interface";
import { Payload } from "./payload.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtAuth implements AuthInterface {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    generateCredentials(params: Payload, options: OptionsAuth): string {
        return this.jwtService.sign(params, options)
    }

    isValid(token: string): boolean {
        try {
            if (!token) {
                throw new Error("Token is invalid")
            }
    
            token = token.replace("Bearer ", "")
            jwt.verify(token, process.env.JWT_SECRET)
            return true;
        } catch (error) {
            return false;
        }
    }
}