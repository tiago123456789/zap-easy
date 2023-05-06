import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity({ name: "schedule_message" })
export class ScheduleMessage {
  
  @ApiProperty({ example: "e1039fe8-2852-4579-86b5-7dd1322e33e6" })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: new Date() })
  @Column("timestamp", { name: "scheduled_at" })
  scheduledAt: Date;

  @Column("bool", { name: "has_processed", default: false })
  hasProcessed: boolean

  @OneToOne(() => Message, (message) => message.id, { nullable: false, eager: true })
  @JoinColumn({ name: "message_id" })
  message: Message
}