import { extname } from 'path';
import { randomBytes } from 'crypto';

export function generateFolderPath(originalFolder: string, originalName: string, extFile?: string) {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const ext = extname(originalName) || `.${extFile}`;
    const timestamp = Math.floor(now.getTime() / 1000);
    const shortUuid = randomBytes(3).toString('hex')
    const filename = `${timestamp}_${shortUuid}${ext}`;

    return {
        key: `${originalFolder}/${yyyy}/${mm}/${dd}/${filename}`,
        folder: `${originalFolder}/${yyyy}/${mm}/${dd}`,
        filename,
    };
}
