import { ApiException } from "./api.exception";

export class NotFoundException extends ApiException {

    constructor(message: string, code: number = 404) {
        super(message, code)
    }
}