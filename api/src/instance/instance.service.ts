import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { StorageInterface } from "src/common/adapters/storage/storage.interface";
import { Provider } from "../common/constants/provider";
import { RepositoryInterface } from "src/instance/adapters/repositories/repository.interface";
import { Instance } from "./instance.entity"

@Injectable()
export class InstanceService {

  constructor(
    @Inject(Provider.INSTANCE_REPOSITORY) private repository: RepositoryInterface<Instance>,
    @Inject(Provider.STORAGE) private storage: StorageInterface,
  ) { }

  create() {
    const instance = new Instance();
    instance.createdAt = new Date();
    instance.updatedAt = new Date();
    return this.repository.save(instance)
  }

  async update(id, modifiedData) {
    await this.findById(id)
    const instance = new Instance();
    instance.isOnline = modifiedData.isOnline;
    instance.updatedAt = new Date();
    return this.repository.update(id, instance)
  }

  async getQrcode(id) {
    await this.findById(id)
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