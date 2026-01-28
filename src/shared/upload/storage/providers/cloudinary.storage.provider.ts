import { Injectable } from '@nestjs/common';
import { STORAGE_IMAGES } from '@/common/constants/storage.constant';
import { StorageProvider, StorageResult } from '../storage.interface';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '@/common/constants/cloudinary.constant';
import axios from 'axios';
import { generateFolderPath } from '../helpers/path.helper';
import { IMAGE_MIME_TO_EXT } from '../constants/image.mime';

@Injectable()
export class CloudinaryStorageProvider implements StorageProvider {
    constructor() {
        cloudinary.config({
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            cloud_name: CLOUDINARY_CLOUD_NAME,
        });
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
        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: folder,
                        public_id: filename,
                        overwrite: false,
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error || !result) {
                            return reject(error);
                        }

                        resolve({
                            key: result.public_id,
                            url: result.secure_url,
                            size: result.bytes,
                        });
                    },
                )
                .end(buffer);
        });
    }

    async uploadFromUrl(url: string): Promise<StorageResult> {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 5000,
        });
        const mime = response.headers['content-type'];
        const buffer = Buffer.from(response.data);

        const file: Express.Multer.File = {
            size: buffer.length,
            buffer,
            mimetype: mime,
            originalname: url.split('/').pop() || 'image',
        } as any;

        const { folder, filename } = generateFolderPath(STORAGE_IMAGES, file.originalname, IMAGE_MIME_TO_EXT[mime]);

        return this.upload({
            folder,
            buffer,
            filename,
            mimeType: file.mimetype
        })
    }

    async exists(key: string): Promise<boolean> {
        try {
            await cloudinary.api.resource(key, {
                resource_type: 'image',
            });
            return true;
        } catch {
            return false;
        }
    }
}
