import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid"

@Entity()
export class NotifyThirdApplicationViaWebhook {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column()
    url: string

    @Column('uuid')
    key: string;

    @BeforeInsert() 
    populate() { 
        this.key = v4();
    }
}