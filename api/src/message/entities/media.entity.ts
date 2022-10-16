import { ApiProperty } from "@nestjs/swagger";
import { TypeMessage } from "src/common/types/type-message";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { v4 } from "uuid"

@Entity()
export class Media {


  @ApiProperty({ example: v4() })
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty({ example: "https://bucket_name.s3.amazonaws.com/16634674178495562985615483" })
  @Column({ length: 150 })
  name: string;

  @ApiProperty({ example: `Example: ${TypeMessage.DOCUMENT}, ${TypeMessage.IMAGE}, ${TypeMessage.TEXT} or ${TypeMessage.VOICE}` })
  @Column({ length: 150 })
  type: TypeMessage;

}