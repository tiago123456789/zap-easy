
export interface RepositoryInterface<T> {

    findOne(id: string): Promise<T>;
    save(newRegister: T): Promise<T>;
    saveMany(newRegisters: T[]): Promise<any>;
    findAllByFilters(filters: T): Promise<T[]>;
    updateMany(ids: string[], modifiedData: T): Promise<void>;   
}