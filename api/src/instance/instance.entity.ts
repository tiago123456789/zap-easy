import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instance {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column('boolean', { default: false })
    isOnline: boolean;

    @Column('timestamp')
    createdAt: Date;

    @Column('timestamp')
    updatedAt: Date;
}

