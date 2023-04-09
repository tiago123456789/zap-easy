import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { Provider } from 'src/common/constants/provider';
import { InstanceRepository } from './adapters/repositories/instance-repository';
import { InstanceCommander } from './instance.command';
import { InstancesController } from './instance.controller';
import { Instance } from './instance.entity';
import { InstanceService } from "./instance.service"
import { InstanceSubscribe } from './instance.subscribe';

@Module({
    imports: [ TypeOrmModule.forFeature([Instance]), CommonModule ],
    controllers: [InstancesController],
    providers: [
        InstanceService, 
        InstanceCommander, 
        {
            provide: Provider.INSTANCE_REPOSITORY,
            useClass: InstanceRepository
        }
    ],
    exports: [InstanceCommander, InstanceSubscribe]
})
export class InstanceModule {}
