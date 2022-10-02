import { IsNotEmpty, IsUUID } from 'class-validator';

export class AuthCredentialDto {
    
    @IsNotEmpty()
    @IsUUID()
    clientId: string;

    @IsNotEmpty()
    @IsUUID()
    clientSecret: string;
}