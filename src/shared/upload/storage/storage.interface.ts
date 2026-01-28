export interface StorageResult {
    key: string;
    url: string;
    size: number;
    mimeType?: string;
}

export interface StorageProvider {
    upload(params: {
        folder: string;
        buffer: Buffer;
        filename: string;
        mimeType: string;
    }): Promise<StorageResult>;

    uploadFromUrl?(url: string): Promise<StorageResult>;

    exists(key: string): Promise<boolean>;
}
