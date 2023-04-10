
export interface RepositoryInterface<T> {

    findByClientId(clientId: string): Promise<T>;
    save(newRegister: T): Promise<T>;
    findByFields(fields: { [key: string]: any }): Promise<T[]>

}