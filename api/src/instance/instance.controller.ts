import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthorizationGuard } from "src/security/authorization.guard";
import { InstanceService } from "./instance.service";

@UseGuards(AuthorizationGuard)
@Controller("instances")
export class InstancesController {

    constructor(
        private readonly instanceService: InstanceService
    ) {}

    @Get()
    findAll() {
        return this.instanceService.findAll();
    }
    
    @Get("/:id")
    getDetails(@Param("id") id: string) {
        return this.instanceService.findById(id)
    }

    @Get("/:id/qrcode")
    async getQrcode(@Param("id") id: string, @Res() response: Response) {
        const html = await this.instanceService.getQrcode(id)
        return response.send(html)
    }
}