import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/message/entities/message.entity";
import { Repository, LessThan, In } from "typeorm";
import { RepositoryInterface } from "./repository.interface";
import { ScheduleMessage } from "src/message/entities/schedule-message.entity";

@Injectable()
export class ScheduleMessageRepository implements RepositoryInterface<ScheduleMessage> {

    constructor(
        @InjectRepository(ScheduleMessage) private repository: Repository<ScheduleMessage>,
    ) { }

    async updateMany(ids: string[], modifiedData: ScheduleMessage): Promise<void> {
        await this.repository.update(
            {
                id: In(ids),
            }, 
            modifiedData
        )
    }

    findAllByFilters(filters: ScheduleMessage): Promise<ScheduleMessage[]> {
        return this.repository.find({
            "hasProcessed": filters.hasProcessed,
            "scheduledAt": LessThan(new Date())
        })
    }

    saveMany(newRegisters: ScheduleMessage[]): Promise<any> {
        return this.repository
            .createQueryBuilder()
            .insert()
            .into(Message)
            .values(newRegisters)
            .execute()
    }

    findOne(id: string): Promise<ScheduleMessage> {
        return this.repository.findOne(id);
    }

    save(newRegister: ScheduleMessage): Promise<ScheduleMessage> {
        return this.repository.save(newRegister)
    }
}