
export interface RepositoryInterface<T> {

    findOne(): Promise<T>
    save(newRegister: T): Promise<T>
    count(): Promise<Number>
}