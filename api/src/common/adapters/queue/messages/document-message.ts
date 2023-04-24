import { TypeMessage } from "../../../../common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class DocumentMessage implements QueueMessage {

    private text: string;
    private to: string;
    private document: string;

    constructor(text: string, to: string, document: string) {
        this.text = text;
        this.to = to;
        this.document = document;
    }
      
    get() {
        return {
            type: TypeMessage.DOCUMENT,
            text: this.text,
            to: this.to,
            document: this.document
        }
    }
}