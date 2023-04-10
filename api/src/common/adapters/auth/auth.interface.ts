import { OptionsAuth } from "./options-auth.interface";
import { Payload } from "./payload.interface";

export interface AuthInterface {

    isValid(token: string): boolean;

    generateCredentials(
        params: Payload, 
        options: OptionsAuth
    ): string;
}