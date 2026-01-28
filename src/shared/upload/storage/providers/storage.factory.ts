import { STORAGE_PROVIDER } from "@/common/constants/storage.constant";
import { LocalStorageProvider } from "./local.provider";
import { CloudinaryStorageProvider } from "./cloudinary.storage.provider";

const storageProviderFactory = () => {
    switch (STORAGE_PROVIDER) {
        case 'cloudinary':
            return new CloudinaryStorageProvider();
        case 'local':
        default:
            return new LocalStorageProvider();
    }
};

export {
    storageProviderFactory
}