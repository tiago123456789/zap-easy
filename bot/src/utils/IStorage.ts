
export interface IStorage {

    uploadFile(filename: string, content: string | Buffer, contentType: string): Promise<void>
}