export const ErrorCode = {
    AUTH: {
        INVALID_TOKEN: 'AUTH_001',
        TOKEN_EXPIRED: 'AUTH_002',
        UNAUTHORIZED: 'AUTH_003',
        EMAIL_EXISTS: 'AUTH_004',
    },
    USER: {
        NOT_FOUND: 'USER_001',
        UPDATE_FAILED: 'USER_002',
    },
    MEDIA: {
        NOT_FOUND: 'MEDIA_001',
        UPLOAD_FAILED: 'MEDIA_002',
        UNSUPPORTED_TYPE: 'MEDIA_003',
    },
    SOCIAL: {
        NOT_FRIEND: 'SOCIAL_002',
        ALREADY_LIKED: 'SOCIAL_001',
        REQUEST_SENT: 'SOCIAL_003',
    },
} as const;
