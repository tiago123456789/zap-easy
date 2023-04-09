import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Instance } from "src/instance/instance.entity";
import { Repository } from "typeorm";
import { RepositoryInterface } from "./repository.interface";

@Injectable()
export class InstanceRepository implements RepositoryInterface<Instance> {

    constructor(
        @InjectRepository(Instance) private repository: Repository<Instance>,
    ) { }

    save(newRegister: Instance): Promise<Instance> {
        return this.repository.save(newRegister);
    }

    async update(id: string, dataModified: Instance): Promise<Instance> {
        await this.repository.update(id, dataModified)
        return dataModified
    }

    findAll(): Promise<Instance[]> {
        return this.repository.find({})
    }

    async findById(id: string): Promise<Instance> {
        return this.repository.findOne({
            where: { id }
        })
    }

}