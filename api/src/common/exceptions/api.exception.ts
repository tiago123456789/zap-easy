
export class ApiException extends Error {

    protected code: number;;

    constructor(message: string, code: number = 500) {
        super(message)
        this.code = code
    }

    getCode(): number {
        return this.code
    }
}