import "dotenv/config";
import * as path from 'path';

const loadStorageConfig = () => {
    const root = process.env.STORAGE_ROOT ?? 'storages';
    const storageRoot = path.join(process.cwd(), root);

    const storageUrl = process.env.STORAGE_URL;
    if (!storageUrl) throw new Error('STORAGE_URL is not defined');

    const storageImage = process.env.STORAGE_IMAGES ?? 'images';
    const storageProvider = process.env.STORAGE_PROVIDER ?? 'local';

    return {
        url: storageUrl,
        root: root,
        images: storageImage,
        provider: storageProvider,
        storageRoot: storageRoot,
    }
}

/**
 * Storage constants
 */
export const STORAGE = Object.freeze(loadStorageConfig());

/**
 * Backward-compatible named exports 
 */
export const ROOT = STORAGE.root;
export const STORAGE_URL = STORAGE.url;
export const STORAGE_ROOT = STORAGE.storageRoot;
export const STORAGE_IMAGES = STORAGE.images;
export const STORAGE_PROVIDER = STORAGE.provider;
