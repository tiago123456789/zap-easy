import { StorageInterface } from "./storage.interface";
import { UploadParams } from "./upload-params.interface";
import { InjectS3, S3 } from "nestjs-s3";

export class S3Storage implements StorageInterface {

    constructor(
        @InjectS3() private readonly s3: S3
    ) {}

    async upload(params: UploadParams): Promise<string> {
        const { Location } = await this.s3.upload({
            // @ts-ignore
            Bucket: process.env.S3_BUCKET,
            Key: params.filename,
            Body: params.content,
            ContentEncoding: params.encoding
        }).promise();

        return Location;
    }

    getLink(filename: string): Promise<string> {
        const url = this.s3.getSignedUrl("getObject", {
            // @ts-ignore
            Bucket: process.env.S3_BUCKET,
            Key: `${filename}.png`,
            Expires: 10
        })

        return Promise.resolve(url);
    }

}