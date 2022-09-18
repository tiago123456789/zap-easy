import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthCredentialCreateDto } from "./dtos/auth-credential-create.dto";
import { AuthCredentialService } from "./auth-credential.service";
import { AuthCredentialDto } from "./dtos/auth-credential.dto";

@Controller("auth")
export class AuthCredentialController {

    constructor(
        private readonly authCredentialService: AuthCredentialService
    ) {}

    @Post()
    @HttpCode(201)
    create(@Body() authCredentialCreateDto: AuthCredentialCreateDto) {
        return this.authCredentialService.create(authCredentialCreateDto)
    }

    @Post("/login")
    @HttpCode(200)
    async authenticate(@Body() authCredentialDto: AuthCredentialDto) {
        const accessToken = await this.authCredentialService.authenticate(authCredentialDto)
        return { accessToken }
    }
}