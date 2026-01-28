import { Injectable } from "@nestjs/common";
import { validateImage } from "./validators/image.validator";
import { STORAGE_IMAGES } from "@/common/constants/storage.constant";
import { StorageService } from "./storage/storage.service";
import { generateFolderPath } from "./storage/helpers/path.helper";

@Injectable()
export class UploadService {
    constructor(private readonly storage: StorageService) { }

    async uploadImage(file: Express.Multer.File) {
        validateImage(file);

        const { folder, filename } = generateFolderPath(STORAGE_IMAGES, file.originalname);

        return this.storage.upload({
            folder: folder,
            buffer: file.buffer,
            filename: filename,
            mimeType: file.mimetype,
        });
    }

    uploadFromUrl(url: string) {
        return this.storage.uploadFromUrl(url);
    }

    async checkExists(key: string) {
        return this.storage.exists(key);
    }
}
