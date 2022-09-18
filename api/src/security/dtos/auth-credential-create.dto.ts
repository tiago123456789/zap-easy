import { IsNotEmpty } from 'class-validator';

export class AuthCredentialCreateDto {
    
    @IsNotEmpty()
    type: string
}