import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";
import { Repository } from "typeorm";
import { RepositoryInterface } from "./repository.interface";

export class MessageRepository implements RepositoryInterface<Message> {

    constructor(
        @InjectRepository(Message) private repository: Repository<Message>,
    ) { }


    save(newRegister: Message): Promise<Message> {
        return this.repository.save(newRegister)
    }


}