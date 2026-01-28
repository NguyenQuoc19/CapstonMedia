import { BadRequestException } from "@nestjs/common";
import { IMAGE_RULE } from "../constants/image.rule";

// validators/image.validator.ts
export function validateImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('IMAGE_REQUIRED');

    if (!IMAGE_RULE.mimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('INVALID_IMAGE_TYPE');
    }

    if (file.size > IMAGE_RULE.maxSize) {
        throw new BadRequestException('IMAGE_TOO_LARGE');
    }
}
