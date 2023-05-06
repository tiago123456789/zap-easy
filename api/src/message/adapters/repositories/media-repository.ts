import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "src/message/entities/media.entity";
import { Repository } from "typeorm";
import { RepositoryInterface } from "./repository.interface";

@Injectable()
export class MediaRepository implements RepositoryInterface<Media> {

    constructor(
        @InjectRepository(Media) private repository: Repository<Media>,
    ) { }

    updateMany(ids: string[], modifiedData: Media): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    findAllByFilters(filters: Media): Promise<Media[]> {
        throw new Error("Method not implemented.");
    }
    
    saveMany(newRegisters: Media[]): Promise<any> {
        throw new Error("Method not implemented.");
    }

    findOne(id: string): Promise<Media> {
        return this.repository.findOne(id);
    }

    save(newRegister: Media): Promise<Media> {
        return this.repository.save(newRegister)
    }


}