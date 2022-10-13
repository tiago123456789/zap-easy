import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthCredentialService } from "./auth-credential.service";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthCredentialController {

    constructor(
        private readonly authCredentialService: AuthCredentialService
    ) {}

    @Post("/login")
    @HttpCode(200)
    async authenticate(@Body() authCredentialDto: AuthCredentialDto) {
        const accessToken = await this.authCredentialService.authenticate(authCredentialDto)
        return { accessToken }
    }
}