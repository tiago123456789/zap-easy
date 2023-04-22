
export interface ICommand {

    execute(message: { [key: string]: any }, client: any): Promise<void> | void;
}