import * as fs from 'fs';
import * as path from 'path';

import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { generateFolderPath } from '../helpers/path.helper';
import { StorageProvider, StorageResult } from '../storage.interface';
import { STORAGE_URL, STORAGE_ROOT, STORAGE_IMAGES } from '@/common/constants/storage.constant';
import { IMAGE_MIME_TO_EXT } from '../constants/image.mime';

@Injectable()
export class LocalStorageProvider implements StorageProvider {
    private readonly storageUrl = STORAGE_URL;
    private readonly storageRoot = STORAGE_ROOT;

    constructor() {
        if (!fs.existsSync(this.storageRoot)) {
            fs.mkdirSync(this.storageRoot, { recursive: true });
        }
    }

    async upload({
        folder,
        buffer,
        filename,
        mimeType,
    }: {
        folder: string;
        buffer: Buffer;
        filename: string;
        mimeType: string;
    }): Promise<StorageResult> {
        const safeName = this.sanitizeFilename(filename);
        const dirPath = path.join(this.storageRoot, folder);
        const filePath = path.join(dirPath, safeName);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        await fs.promises.writeFile(filePath, buffer);

        const key = `${folder}/${safeName}`;

        return {
            key,
            url: `${this.storageUrl}/${key}`,
            size: buffer.length,
        };
    }

    async uploadFromUrl(url: string): Promise<StorageResult> {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 5000,
        });
        const buffer = Buffer.from(response.data);
        const mime = response.headers['content-type'];

        const file: Express.Multer.File = {
            size: buffer.length,
            buffer,
            mimetype: mime,
            originalname: url.split('/').pop() || 'image',
        } as any;

        const { folder, filename } = generateFolderPath(STORAGE_IMAGES, file.originalname, IMAGE_MIME_TO_EXT[mime]);
        return this.upload({
            folder,
            buffer: file.buffer,
            filename,
            mimeType: file.mimetype
        });
    }

    async exists(key: string): Promise<boolean> {
        const filePath = path.join(this.storageRoot, key);
        return fs.existsSync(filePath);
    }

    // -----------------------
    // helpers
    // -----------------------
    private sanitizeFilename(filename: string): string {
        return filename
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9.\-_]/g, '');
    }
}
