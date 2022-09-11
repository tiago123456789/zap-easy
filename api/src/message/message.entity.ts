import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text')
  text: string;

  @Column("timestamp", { name: "sended_at" })
  sendedAt: Date;

  @Column("timestamp", { name: "created_at" })
  createdAt: Date;

  @Column("timestamp", { name: "updated_at" })
  updatedAt: Date;

  @Column({ length: 14 })
  to: string;
}