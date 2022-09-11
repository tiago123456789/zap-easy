
export interface Exchange {
    name: string;
    type: string;
    routingKey: string;
    options: { [key: string]: any }
}