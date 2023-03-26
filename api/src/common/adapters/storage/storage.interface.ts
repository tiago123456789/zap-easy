import { UploadParams } from "./upload-params.interface";

export interface StorageInterface {

    upload(params: UploadParams): Promise<string>;

    getLink(filename: string): Promise<string>;
}