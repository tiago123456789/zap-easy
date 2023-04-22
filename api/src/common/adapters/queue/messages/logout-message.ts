import { TypeMessage } from "src/common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class LogoutMessage implements QueueMessage {

    private instanceId: string;

    constructor(instanceId: string) {
        this.instanceId = instanceId;
    }
      
    get() {
        return {
            instanceId: this.instanceId
        }
    }
}