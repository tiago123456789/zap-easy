import { TypeMessage } from "src/common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class VoiceMessage implements QueueMessage {

    get() {
        return {
            type: TypeMessage.VOICE,
        }
    }
}