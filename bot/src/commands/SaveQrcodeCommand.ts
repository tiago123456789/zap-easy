import { IStorage } from "../utils/IStorage";
import S3Storage from "../utils/S3Storage"
import { ICommand } from "./ICommand";
import * as qrImage from 'qr-image'

export default class SaveQrcodeCommand implements ICommand {

    constructor(
        private storage: IStorage = new S3Storage()
    ) {}

    async execute(data: { [key: string]: any }, client: any): Promise<void> {
        data.content = qrImage.imageSync(data.content, { type: 'png' });
        return this.storage.uploadFile(data.filename, data.content, data.contentType)
    }
}