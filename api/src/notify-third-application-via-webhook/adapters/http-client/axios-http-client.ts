import { Injectable } from "@nestjs/common";
import axios from "axios";
import { HttpClientResponse } from "./http-client-response.interface";
import { HttpClientInterface } from "./http-client.interface";

@Injectable()
export class AxiosHttpClient implements HttpClientInterface {

    post(
        url: string,
        data: { [key: string]: any; },
        headers: { [key: string]: any; } | null
    ): Promise<HttpClientResponse> {
        if (headers)
            return axios.post(url, data, headers)

        return axios.post(url, data)
    }


}