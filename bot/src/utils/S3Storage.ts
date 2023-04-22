import { IStorage } from "./IStorage";
import AWS, { S3 } from "aws-sdk"

export default class S3Storage implements IStorage {

    private client: S3;

    constructor() {
        this.client =  new AWS.S3({
            credentials: {
                // @ts-ignore
                accessKeyId: process.env.S3_CLIENT_ID,
                // @ts-ignore
                secretAccessKey: process.env.S3_CLIENT_SECRET
            }
        })
    }

    async uploadFile(
        filename: string, 
        content: string | Buffer, 
        contentType: string
    ): Promise<void> {
        await this.client.upload({
            ACL: "public-read",
            // @ts-ignore
            Bucket: process.env.S3_BUCKET,
            Key: filename,
            ContentType: contentType,
            Body: content
        }).promise()
    }

}