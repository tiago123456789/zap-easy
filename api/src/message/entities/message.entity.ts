import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Media } from "./media.entity";
import { Instance } from "../../instance/instance.entity";

@Entity()
export class Message {
  
  @ApiProperty({ example: "e1039fe8-2852-4579-86b5-7dd1322e33e6" })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: "Hello world" })
  @Column('text')
  text: string;

  @ApiProperty({ example: new Date() })
  @Column("timestamp", { name: "sended_at" })
  sendedAt: Date;

  @ApiProperty({ example: new Date() })
  @Column("timestamp", { name: "created_at" })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @Column("timestamp", { name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({ example: "556112341234" })
  @Column({ length: 14 })
  to: string;

  @ApiProperty({ example: Media })
  @OneToOne(() => Media, (media) => media.id, { nullable: true, eager: true })
  @JoinColumn({ name: "media_id" })
  media: Media;

  @ManyToOne(() => Instance, (instance) => instance.id, { nullable: true, eager: true })
  @JoinColumn({ name: "instance_id" })
  instance: Instance
}