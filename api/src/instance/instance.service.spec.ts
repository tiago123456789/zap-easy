import { Instance } from "./instance.entity";
import { InstanceService } from "./instance.service"
import { RepositoryInterface } from "src/instance/adapters/repositories/repository.interface";
import { StorageInterface } from "src/common/adapters/storage/storage.interface";
import { ProducerInterface } from "src/common/adapters/queue/producer.interface";

describe("InstanceService", () => {
  let repository: jest.Mocked<RepositoryInterface<Instance>>;
  let storage: jest.Mocked<StorageInterface>;  
  let queueProducer: jest.Mocked<ProducerInterface>;

  const fakeId = 'e5e49bd4-9ab9-459a-86cb-c3597e3d7f85'

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    storage = {
      upload: jest.fn(),
      getLink: jest.fn(),
    };
    queueProducer = {
      publish: jest.fn(),
      publishMany: jest.fn()
    };
  })

  it("Should be throw exception when try get instance not exist", async () => {
    try {
      const instanceService = new InstanceService(
        repository, storage, queueProducer
      );

      repository.findById.mockReturnValue(null)
      await instanceService.findById(fakeId)
    } catch (error) {
      expect(error.message).toBe("Instance not found")
    }
  })

  it("Should be get instance success", async () => {
    const instance = new Instance();
    instance.id = fakeId;
    instance.name = "Fake test"
    instance.isOnline = false;
    instance.createdAt = new Date();
    instance.updatedAt = new Date();

    const instanceService = new InstanceService(
      repository, storage, queueProducer
    );

    repository.findById.mockResolvedValue(instance)
    const instanceReturn = await instanceService.findById(fakeId)
    expect(instanceReturn.id).toBe(instance.id)
    expect(instanceReturn.isOnline).toBe(instance.isOnline)
    expect(instanceReturn.createdAt).toBe(instance.createdAt)
    expect(instanceReturn.updatedAt).toBe(instance.updatedAt)
  })


  it("Should be create instance success", async () => {
    const instanceService = new InstanceService(
      repository, storage, queueProducer
    );

    await instanceService.create("fake support");
    expect(repository.save).toHaveBeenCalledTimes(1)
  })

  it("Should be throw exception when try update instance data, but not exist", async () => {
    try {
      const instanceService = new InstanceService(
        repository, storage, queueProducer
      );

      repository.findById.mockReturnValue(null)
      await instanceService.update(fakeId, { isOnline: false })
    } catch (error) {
      expect(error.message).toBe("Instance not found")
    }
  })

  it("Should be update instance data success", async () => {
    const instance = new Instance();
    instance.id = fakeId;
    instance.isOnline = false;
    instance.createdAt = new Date();
    instance.updatedAt = new Date();

    const instanceService = new InstanceService(
      repository, storage, queueProducer
    );

    repository.findById.mockResolvedValue(instance)
    repository.update.mockResolvedValue(instance)
    const instanceReturn = await instanceService.update(fakeId, instance)
    expect(instanceReturn.id).toBe(instance.id)
    expect(instanceReturn.isOnline).toBe(instance.isOnline)
    expect(instanceReturn.createdAt).toBe(instance.createdAt)
    expect(instanceReturn.updatedAt).toBe(instance.updatedAt)
  })


  it("Should be list instances with 2 items", async () => {
    const instance = new Instance();
    instance.id = fakeId;
    instance.isOnline = false;
    instance.createdAt = new Date();
    instance.updatedAt = new Date();

    const instanceService = new InstanceService(
      repository, storage, queueProducer
    );

    repository.findAll.mockResolvedValue([instance, instance])
    const instances = await instanceService.findAll()
    expect(instances.length).toBe(2)
    expect(instances[0].id).toBe(instance.id)
    expect(instances[0].isOnline).toBe(instance.isOnline)
    expect(instances[0].createdAt).toBe(instance.createdAt)
    expect(instances[0].updatedAt).toBe(instance.updatedAt)
  })


  it("Should be throw exception when try get qrcode instance, but not exist", async () => {
    try {
      const instanceService = new InstanceService(
        repository, storage, queueProducer
      );

      repository.findById.mockReturnValue(null)
      await instanceService.getQrcode(fakeId)
    } catch (error) {
      expect(error.message).toBe("Instance not found")
    }
  })

  it("Should be get qrcode instance", async () => {
    const instance = new Instance();
    instance.id = fakeId;
    instance.isOnline = true;
    instance.createdAt = new Date();
    instance.updatedAt = new Date();

    const instanceService = new InstanceService(
      repository, storage, queueProducer
    );

    repository.findById.mockResolvedValue(instance)
    await instanceService.getQrcode(fakeId)
    expect(storage.getLink).toBeCalledTimes(1)
  })

})