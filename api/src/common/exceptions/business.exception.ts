import { ApiException } from "./api.exception";

export class BusinessException extends ApiException {

    constructor(message: string, code: number = 409) {
        super(message, code)
    }
}