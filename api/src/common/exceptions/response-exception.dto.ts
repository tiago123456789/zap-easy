import { ApiProperty } from "@nestjs/swagger";

export class ResponseExceptionDto {

    @ApiProperty({ example: "200", description: "The http status code"})
    statusCode: number;

    @ApiProperty({ example: "2023-04-29T10:50:00.177Z", description: "Date occour error"})
    timestamp: string;

    @ApiProperty({ example: "The problem error message here", description: "The error message"})
    message: string;

    constructor(statusCode: number, timestamp: string, message: string) {
        this.statusCode = statusCode;
        this.timestamp = timestamp;
        this.message = message;
    }

    get(): { [key:string]: any } {
        return {
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            message: this.message
        }
    }
}