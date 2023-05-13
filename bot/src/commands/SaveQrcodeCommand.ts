import { ILogger } from "../utils/ILogger";
import { IStorage } from "../utils/IStorage";
import S3Storage from "../utils/S3Storage"
import { ICommand } from "./ICommand";
import * as qrImage from 'qr-image'

export default class SaveQrcodeCommand implements ICommand {

    constructor(
        private storage: IStorage,
        private logger: ILogger
    ) {}

    async execute(data: { [key: string]: any }, client: any): Promise<void> {
        this.logger.info(`Uploading new qrcode to the instance name ${data.sessionName}`)
        data.content = qrImage.imageSync(data.content, { type: 'png' });
        const response = await this.storage.uploadFile(
            data.filename, data.content, data.contentType
        )
        return response;
    }
}