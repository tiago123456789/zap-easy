import { Webhook } from "src/webhook/webhook.entity";
import { RepositoryInterface } from "./repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WebhookRepository implements RepositoryInterface<Webhook> {


    constructor(
        @InjectRepository(Webhook) private repository: Repository<Webhook>,
    ) { }

    findOne(id: string): Promise<Webhook> {
        return this.repository.findOne(id);
    }

    save(newRegister: Webhook): Promise<Webhook> {
        return this.repository.save(newRegister);
    }

}