import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid"

@Entity()
export class Webhook {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    key: string;

    @BeforeInsert() 
    populate() { 
        this.key = v4();
    }

}
