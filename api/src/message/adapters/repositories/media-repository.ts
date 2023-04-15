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

    findOne(id: string): Promise<Media> {
        return this.repository.findOne(id);
    }


    save(newRegister: Media): Promise<Media> {
        return this.repository.save(newRegister)
    }


}