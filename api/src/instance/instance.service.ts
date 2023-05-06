import { Inject, Injectable } from "@nestjs/common";
import { StorageInterface } from "../common/adapters/storage/storage.interface";
import { Provider } from "../common/constants/provider";
import { RepositoryInterface } from "../instance/adapters/repositories/repository.interface";
import { Instance } from "./instance.entity"
import { ProducerInterface } from "../common/adapters/queue/producer.interface";
import { LogoutMessage } from "../common/adapters/queue/messages/logout-message";
import { Exchange, RoutingKey } from "../common/constants/rabbitmq";
import { NotFoundException } from "../common/exceptions/notfound.exception";
import { BusinessException } from "../common/exceptions/business.exception";
import { LoggerInterface } from "src/common/adapters/logger/logger.interface";

@Injectable()
export class InstanceService {

  constructor(
    @Inject(Provider.INSTANCE_REPOSITORY) private repository: RepositoryInterface<Instance>,
    @Inject(Provider.STORAGE) private storage: StorageInterface,
    @Inject(Provider.QUEUE_PRODUCER) private queueProducer: ProducerInterface,
    @Inject(Provider.LOGGER) private logger: LoggerInterface
  ) { }

  create(name: string) {
    const instance = new Instance();
    instance.name = name;
    instance.createdAt = new Date();
    instance.updatedAt = new Date();
    return this.repository.save(instance)
  }

  async logout(id: string): Promise<void> {
    const instance = await this.findById(id);
    if (!instance.isOnline) {
      throw new BusinessException("You can't logout instance is not online")
    }

    await this.update(id, { isOnline: false })
    await this.queueProducer.publish({
      exchange: Exchange.LOGOUT_INSTANCE,
      routingKey: id
    }, new LogoutMessage(id))
  }

  async update(id, modifiedData) {
    try {
      this.logger.info(`Updating instance with id ${id}`)
      const instance = await this.repository.findById(id)
      if (!instance) {
        return;
      }
      instance.isOnline = modifiedData.isOnline;
      instance.updatedAt = new Date();
      const instanceUpdated: Instance = await this.repository.update(id, instance)
      this.logger.info(`Updated instance with id ${id}`)
      return instanceUpdated
    } catch(error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getQrcode(id) {
    const instance = await this.findById(id)
    if (!instance.isOnline) {
      throw new BusinessException("You can't read qrcode instance is offline")
    }

    const url = await this.storage.getLink(`${id}.png`)
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
    return this.repository.findAll()
  }

  async findById(id): Promise<Instance> {
    const register: Instance = await this.repository.findById(id)
    if (!register) {
      throw new NotFoundException("Instance not found")
    }

    return register;
  }

}