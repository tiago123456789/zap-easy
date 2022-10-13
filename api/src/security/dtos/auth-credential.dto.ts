import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AuthCredentialDto {
    
    @ApiProperty({ example: '4cecee33-7e38-4c99-bca4-c58b73dc2efc', description: 'The clientId generated' })
    @IsNotEmpty()
    @IsUUID()
    clientId: string;

    @ApiProperty({ example: '4cecee33-7e38-4c99-bca4-c58b73dc2efd', description: 'The clientSecret generated' })
    @IsNotEmpty()
    @IsUUID()
    clientSecret: string;
}