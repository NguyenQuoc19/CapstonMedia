import { Inject, Injectable } from "@nestjs/common";

import type { StorageProvider, StorageResult } from "./storage.interface";

@Injectable()
export class StorageService {
    constructor(
        @Inject('STORAGE_PROVIDER')
        private readonly provider: StorageProvider,
    ) { }

    upload(params) {
        return this.provider.upload(params);
    }

    uploadFromUrl(url: string) {
        if (!this.provider.uploadFromUrl) throw new Error('Upload from URL not supported');
        return this.provider.uploadFromUrl(url);
    }

    exists(key: string) {
        return this.provider.exists(key);
    }
}
