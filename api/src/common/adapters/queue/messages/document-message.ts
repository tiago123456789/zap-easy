import { TypeMessage } from "src/common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class DocumentMessage implements QueueMessage {

    get() {
        return {
            type: TypeMessage.DOCUMENT,
        }
    }
}