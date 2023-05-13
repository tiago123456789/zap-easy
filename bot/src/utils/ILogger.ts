export interface ILogger {

    info(data: string | { [key: string]: any }): void;
    error(data: string | { [key: string]: any }): void;
}