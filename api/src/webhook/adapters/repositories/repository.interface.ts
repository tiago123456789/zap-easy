
export interface RepositoryInterface<T> {

    save(newRegister: T): Promise<T>;
    findOne(id: string): Promise<T>;

}