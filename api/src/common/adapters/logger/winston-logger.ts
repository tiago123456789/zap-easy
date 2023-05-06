import { Inject, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export class WinstonLogger {

    constructor(
        @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
    ) { }

    info(data: string | { [key: string]: any }): void {
        this.logger.log(data);
    }
    
    error(data: string | { [key: string]: any }): void {
        this.logger.error(data);
    }
}