import { HttpClientResponse } from "./http-client-response.interface";

export interface  HttpClientInterface {

    post(
        url: string, 
        data: { [key: string]: any }, 
        headers: { [key: string]: any }
    ): Promise<HttpClientResponse>;

}