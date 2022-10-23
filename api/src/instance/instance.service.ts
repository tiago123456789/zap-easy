import { Nack, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InjectS3, S3 } from "nestjs-s3";
import { Repository } from "typeorm";
import { Instance } from "./instance.entity"
import Queue from "../common/constants/Queue"

@Injectable()
export class InstanceService {

  constructor(
    @InjectRepository(Instance) private repository: Repository<Instance>,
    @InjectS3() private readonly s3: S3
  ) { }

  create() {
    const instance = new Instance();
    instance.createdAt = new Date();
    instance.updatedAt = new Date();
    return this.repository.save(instance)
  }

  async update(id, modifiedData) {
    return this.repository.update({ id }, {
      updatedAt: new Date(), isOnline: modifiedData.isOnline
    })
  }

  async getQrcode(id) {
    await this.findById(id)
    const url = this.s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET,
      Key: `${id}.png`,
      Expires: 10
    })

    return `
      <body style="background: black" >
      <img src=${url} style="margin-left: 40%; margin-top: 100px" with='250px' heigth='250px'/>
      <script>
          setInterval(() => location.reload(), (20 * 1000))
      </script>
      </body>
    `;

  }

  findAll(): Promise<Instance[]> {
    return this.repository.find({})
  }

  async findById(id): Promise<Instance> {
    const register: Instance = await this.repository.findOne({
      where: { id }
    })

    if (!register) {
      throw new NotFoundException("Instance not found")
    }

    return register;
  }

  @RabbitSubscribe({
    exchange: Queue.UPDATE_STATUS_INSTANCE.EXCHANGE,
    routingKey: Queue.UPDATE_STATUS_INSTANCE.ROUTING_KEY,
    queue: Queue.UPDATE_STATUS_INSTANCE.QUEUE,
    queueOptions: {
      ...Queue.UPDATE_STATUS_INSTANCE.QUEUE_OPTIONS,
      // @ts-ignore
      arguments: {
        'x-dead-letter-exchange': Queue.UPDATE_STATUS_INSTANCE_DLQ.EXCHANGE,
        'x-dead-letter-routing-key': Queue.UPDATE_STATUS_INSTANCE_DLQ.ROUTING_KEY,
      }
    }
  })
  public async updateStatusInstance(msg: { [key: string]: any }) {
    try {
      await this.update(msg.id, msg)
    } catch (error) {
      return new Nack(false)
    }

  }
}