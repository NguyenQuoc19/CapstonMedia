import "dotenv/config";

const loadCloudDinaryConfig = () => {
    const url = process.env.CLOUDINARY_URL;
    if (!url) throw new Error('CLOUDINARY_URL is not defined');

    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!apiKey) throw new Error('CLOUDINARY_API_KEY is not defined');

    const apiSecrect = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecrect) throw new Error('CLOUDINARY_API_SECRET is not defined');

    const cloundName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloundName) throw new Error('CLOUDINARY_CLOUD_NAME is not defined');

    return {
        url,
        apiKey,
        apiSecrect,
        cloundName
    }
}

/**
 * Cloudinary constants
 */
export const CLOUDINARY = Object.freeze(loadCloudDinaryConfig());

/**
 * Backward-compatible named exports 
 */
export const CLOUDINARY_URL = CLOUDINARY.url;
export const CLOUDINARY_API_KEY = CLOUDINARY.apiKey;
export const CLOUDINARY_API_SECRET = CLOUDINARY.apiSecrect;
export const CLOUDINARY_CLOUD_NAME = CLOUDINARY.cloundName;