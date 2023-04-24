import { TypeMessage } from "../../../types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class TextMessage implements QueueMessage {

    private text: string;
    private to: string;

    constructor(text: string, to: string) {
        this.text = text;
        this.to = to
    }

    get() {
        return {
            type: TypeMessage.TEXT,
            text: this.text,
            to: this.to
        }
    }
}