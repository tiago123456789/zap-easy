import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid"

@Entity()
export class AuthCredential {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('uuid')
    clientId: string;

    @Column('uuid')
    clientSecret: string;

    @Column('varchar')
    type: string;

    @Column("varchar", { nullable: true })
    domain: string

    @BeforeInsert() 
    populate() { 
        this.clientId = v4();
        this.clientSecret = v4();
    }

}

