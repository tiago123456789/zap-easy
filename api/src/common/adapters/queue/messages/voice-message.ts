import { TypeMessage } from "../../../../common/types/type-message";
import { QueueMessage } from "./queue-message.interface";

export class VoiceMessage implements QueueMessage {

    private text: string;
    private to: string;
    private audio: string;

    constructor(text: string, to: string, audio: string) {
        this.text = text;
        this.to = to;
        this.audio = audio;
    }

    get() {
        return {
            type: TypeMessage.VOICE,
            text: this.text,
            to: this.to,
            audio: this.audio
        }
    }
}