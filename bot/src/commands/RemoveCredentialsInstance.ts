import { ILogger } from "../utils/ILogger";
import { ICommand } from "./ICommand";
import fs from "fs"

export default class RemoveCredentialsInstance implements ICommand {

    constructor(
        private logger: ILogger
    ) {}

    execute(message: { [key: string]: any; }, client: any): Promise<void> | void {
        this.logger.info(`Deleting old session to ${message.sessionName}`)
        if (fs.existsSync(message.pathSession)) {
            fs.rmdirSync(message.pathSession, { recursive: true });
        }
        this.logger.info(`Deleted old session to ${message.sessionName}`)

    }

}