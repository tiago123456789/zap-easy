import { ILogger } from "./ILogger";
import * as winston from 'winston'

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'bot' },
    transports: [
        new winston.transports.File({ 
            dirname: 'logs', filename: 'error.log', level: 'error' 
        }),
        new winston.transports.File({ 
            dirname: 'logs', filename: 'info.log', level: "info" 
        }),
    ],
});

class WinstonLogger implements ILogger {

    info(data: string | { [key: string]: any; }): void {
        logger.info(data);
    }

    error(data: string | { [key: string]: any; }): void {
        logger.error(data)
    }

}

const winstonLogger = new WinstonLogger();

export default winstonLogger;

