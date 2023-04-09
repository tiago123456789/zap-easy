
export interface RepositoryInterface<T> {

    save(newRegister: T): Promise<T>;
}