import { ApiProperty } from "@nestjs/swagger";
import { v4 } from "uuid"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instance {

    @ApiProperty({ example: v4() })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "varchar", length: 170, nullable: true })
    name: string;

    @ApiProperty({ example: new Date() })
    @Column('boolean', { default: false })
    isOnline: boolean;

    @ApiProperty({ example: new Date() })
    @Column('timestamp')
    createdAt: Date;

    @ApiProperty({ example: new Date() })
    @Column('timestamp')
    updatedAt: Date;
}

