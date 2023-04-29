import { Body, Controller, HttpCode, Post, UseFilters } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthCredentialService } from "./auth-credential.service";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";
import { AuthenticatedSuccessDto } from "./dtos/authenticated-success.dto";
import { HandlerException } from "src/common/exceptions/handler.exception";
import { ResponseExceptionDto } from "src/common/exceptions/response-exception.dto";

@ApiTags("Auth")
@UseFilters(new HandlerException())
@Controller("auth")
export class AuthCredentialController {

    constructor(
        private readonly authCredentialService: AuthCredentialService
    ) {}

    @ApiResponse({
        status: 200,
        type: AuthenticatedSuccessDto,
        description: "Authenticated successfully"
    })
    @ApiResponse({
        status: 400,
        type: ResponseExceptionDto,
        description: "Credentials invalid!"
    })
    @Post("/login")
    async authenticate(@Body() authCredentialDto: AuthCredentialDto): Promise<AuthenticatedSuccessDto> {
        const accessToken = await this.authCredentialService.authenticate(authCredentialDto)
        return { accessToken }
    }
}