import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstanceCommander } from './instance.command';
import { InstancesController } from './instance.controller';
import { Instance } from './instance.entity';
import { InstanceService } from "./instance.service"

@Module({
    imports: [ TypeOrmModule.forFeature([Instance])],
    controllers: [InstancesController],
    providers: [InstanceService, InstanceCommander],
    exports: [InstanceCommander]
})
export class InstanceModule {}
