import { ICommand } from "./ICommand";

export default class LogoutInstanceCommand implements ICommand {

    execute(message: { [key: string]: any; }, client: any): Promise<void> | void {
        setTimeout(() => {
            console.log(`Logout instance ${message.sessionName}`)
            process.exit()
        }, 4000)
    }

}