import { ApiException } from "./api.exception";

export class InvalidDataException extends ApiException {

    constructor(message: string, code: number = 400) {
        super(message, code)
    }
}