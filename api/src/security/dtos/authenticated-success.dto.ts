import { ApiProperty } from "@nestjs/swagger";

export class AuthenticatedSuccessDto {

    @ApiProperty({ example: "token_jwt_generated_here", description: "The jwt token to use to next requests on api"})
    accessToken: string;
}

