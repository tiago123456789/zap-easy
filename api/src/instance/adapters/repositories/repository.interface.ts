
export interface RepositoryInterface<T> {

    save(newRegister: T): Promise<T>;
    update(id: string, dataModified: T): Promise<T>;
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;    
}