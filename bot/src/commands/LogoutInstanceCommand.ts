import { ILogger } from "../utils/ILogger";
import { ICommand } from "./ICommand";

export default class LogoutInstanceCommand implements ICommand {

    constructor(private logger: ILogger) {}

    execute(message: { [key: string]: any; }, client: any): Promise<void> | void {
        setTimeout(() => {
            this.logger.info(`Logout instance named ${message.sessionName}`)
            process.exit()
        }, 4000)
    }

}