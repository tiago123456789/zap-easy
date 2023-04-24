import { ApiProperty } from "@nestjs/swagger";
import { v4 } from "uuid"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Instance {

    @ApiProperty({ example: v4() })
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

