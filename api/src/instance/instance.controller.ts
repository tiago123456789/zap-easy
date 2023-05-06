import { Controller, Get, Param, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthorizationGuard } from "src/security/authorization.guard";
import { Instance } from "./instance.entity";
import { InstanceService } from "./instance.service";
import { HandlerException } from "src/common/exceptions/handler.exception";
import { ResponseExceptionDto } from "src/common/exceptions/response-exception.dto";

@ApiBearerAuth("TOKEN_JWT")
@ApiResponse({
    status: 403,
    type: ResponseExceptionDto,
    description: "Action not allowed. The request needs send jwt token in request"
})
@ApiTags("Instances")
@UseGuards(AuthorizationGuard)
@UseFilters(HandlerException)
@Controller("instances")
export class InstancesController {

    constructor(
        private readonly instanceService: InstanceService
    ) {}


    @ApiResponse({
        status: 200,
        isArray: true,
        type: Instance,
        description: "This endpoint give all instances created"
    })
    @Get()
    findAll(): Promise<Instance[]> {
        return this.instanceService.findAll();
    }
    

    @ApiResponse({
        status: 200,
        type: Instance,
        description: "This endpoint give details about the instance"
    })
    @ApiResponse({
        status: 404,
        description: "You informed wrong id or instance not found"
    })
    @Get("/:id")
    getDetails(@Param("id") id: string): Promise<Instance> {
        return this.instanceService.findById(id)
    }
    

    @ApiResponse({
        status: 200,
        description: "This endpoint is responsible show you the instance qrcode. WARNING: response is html with qrcode"
    })
    @ApiResponse({
        status: 404,
        description: "You informed wrong id or instance not found"
    })
    @ApiResponse({
        status: 409,
        description: "You try read qrcode but instance is offline"
    })
    @ApiParam({
        name: "id",
        description: "The instance id"
    })
    @Get("/:id/qrcode")
    async getQrcode(@Param("id") id: string, @Res() response: Response) {
        const html = await this.instanceService.getQrcode(id)
        return response.send(html)
    }

    @ApiResponse({
        status: 200,
        description: "This endpoint is responsible show you the instance qrcode. WARNING: response is html with qrcode"
    })
    @ApiResponse({
        status: 409,
        description: "You try logout instance is offline"
    })
    @ApiResponse({
        status: 404,
        description: "You informed wrong id or instance not found"
    })
    @ApiParam({
        name: "id",
        description: "The instance id"
    })
    @Get("/:id/logout")
    async logout(@Param("id") id: string): Promise<void> {
        return this.instanceService.logout(id)
    }
}