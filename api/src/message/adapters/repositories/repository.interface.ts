
export interface RepositoryInterface<T> {

    findOne(id: string): Promise<T>;
    save(newRegister: T): Promise<T>;
}