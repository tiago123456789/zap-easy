import { TypeMessage } from "src/common/types/type-message";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Media {
    
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150 })
  type: TypeMessage;

}