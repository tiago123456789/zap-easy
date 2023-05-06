import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";
import { Repository, In } from "typeorm";
import { RepositoryInterface } from "./repository.interface";

@Injectable()
export class MessageRepository implements RepositoryInterface<Message> {

    constructor(
        @InjectRepository(Message) private repository: Repository<Message>,
    ) { }
    
    updateMany(ids: string[], modifiedData: Message): Promise<void> {
        throw new Error("Method not implemented.");
    }

    findAllByFilters(filters: Message): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }

    saveMany(newRegisters: Message[]): Promise<any> {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(Message)
            .values(newRegisters)
            .execute()
    }

    findOne(id: string): Promise<Message> {
        return this.repository.findOne(id);
    }


    save(newRegister: Message): Promise<Message> {
        return this.repository.save(newRegister)
    }


}