import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthCredentialService } from "./auth-credential.service";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";
import { AuthenticatedSuccessDto } from "./dtos/authenticated-success.dto";

@ApiTags("Auth")
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
    @Post("/login")
    @HttpCode(200)
    async authenticate(@Body() authCredentialDto: AuthCredentialDto): Promise<AuthenticatedSuccessDto> {
        const accessToken = await this.authCredentialService.authenticate(authCredentialDto)
        return { accessToken }
    }
}