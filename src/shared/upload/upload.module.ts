import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { StorageService } from "./storage/storage.service";
import { UploadController } from "./upload.controller";
import { storageProviderFactory } from "./storage/providers/storage.factory";

@Module({
    controllers: [UploadController],
    providers: [
        UploadService,
        StorageService,
        {
            provide: 'STORAGE_PROVIDER',
            useFactory: storageProviderFactory
        },
    ],
    exports: [UploadService],
})

export class UploadModule { }
