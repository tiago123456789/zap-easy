import { ICommand } from "./ICommand";
import fs from "fs"

export default class RemoveCredentialsInstance implements ICommand {

    execute(message: { [key: string]: any; }, client: any): Promise<void> | void {
        if (fs.existsSync(message.pathSession)) {
            fs.rmdirSync(message.pathSession, { recursive: true });
        }
    }

}