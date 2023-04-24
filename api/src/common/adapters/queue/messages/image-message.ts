import { TypeMessage } from "../../../../common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class ImageMessage implements QueueMessage {

    private text: string;
    private to: string;
    private image: string; 

    constructor(text: string, to: string, image: string) {
        this.text = text;
        this.to = to;
        this.image = image;
    }

    get() {
        return {
            type: TypeMessage.IMAGE,
            text: this.text,
            to: this.to,
            image: this.image
        }
    }
}