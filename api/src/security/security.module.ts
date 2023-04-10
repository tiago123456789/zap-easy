import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthCredentialController } from './auth-credential.controller';
import { AuthCredential } from './auth-credential.entity';
import { AuthCredentialService } from './auth-credential.service';
import { AuthCredentialCommander } from './auth-credential.command';
import { CommonModule } from 'src/common/common.module';
import { Provider } from 'src/common/constants/provider';
import { AuthCredentialRepository } from './adapters/repositories/auth-credential-repository';

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
        }),
        CommonModule
    ],
    controllers: [AuthCredentialController],
    providers: [
        AuthCredentialService, 
        AuthCredentialCommander,
        {
            provide: Provider.AUTH_CREDENTIAL_REPOSITORY,
            useClass: AuthCredentialRepository
        }
    ],
    exports: [AuthCredentialCommander, AuthCredentialService]
})
export class SecurityModule {}
