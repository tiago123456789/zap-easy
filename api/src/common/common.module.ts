import { Module } from '@nestjs/common';
import { JwtAuth } from './adapters/auth/jwt-auth';
import { S3Storage } from './adapters/storage/s3-storage';
import { Provider } from './constants/provider';

@Module({
    exports: [
        {
            provide: Provider.STORAGE,
            useClass: S3Storage
        },
        {
            provide: Provider.AUTH,
            useClass: JwtAuth
        }
    ]
})
export class CommonModule {}
