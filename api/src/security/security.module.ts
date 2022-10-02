import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthCredentialController } from './auth-credential.controller';
import { AuthCredential } from './auth-credential.entity';
import { AuthCredentialService } from './auth-credential.service';
import { config } from 'rxjs';
import { AuthCredentialCommander } from './auth-credential.command';

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthCredential]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get("JWT_SECRET"),
                }
            }
        })
    ],
    controllers: [AuthCredentialController],
    providers: [AuthCredentialService, AuthCredentialCommander],
    exports: [AuthCredentialCommander, AuthCredentialService]
})
export class SecurityModule {}
