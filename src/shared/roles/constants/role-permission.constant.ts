import { PERMISSION } from "./permission.constants";

export const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
    USER: [
        PERMISSION.PROFILE_READ,
        PERMISSION.PROFILE_CREATE,
        PERMISSION.PROFILE_UPDATE,
    ],
    ADMIN: Object.values(PERMISSION),
};
