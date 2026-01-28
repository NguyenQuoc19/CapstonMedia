import { ErrorCode } from '../constants/error-code.constant';

export const ErrorMessageMap: Record<string, string> = {
    /** ================= AUTH ================= */
    [ErrorCode.AUTH.UNAUTHORIZED]: 'Unauthorized',
    [ErrorCode.AUTH.EMAIL_EXISTS]: 'Email already exists',
    [ErrorCode.AUTH.INVALID_TOKEN]: 'Invalid token',
    [ErrorCode.AUTH.TOKEN_EXPIRED]: 'Token expired',

    /** ================= USER ================= */
    [ErrorCode.USER.NOT_FOUND]: 'User not found',
    [ErrorCode.USER.UPDATE_FAILED]: 'Profile update failed',

    /** ================= MEDIA ================= */
    [ErrorCode.MEDIA.NOT_FOUND]: 'Media not found',
    [ErrorCode.MEDIA.UPLOAD_FAILED]: 'Upload failed',
    [ErrorCode.MEDIA.UNSUPPORTED_TYPE]: 'Unsupported media type',

    /** ================= SOCIAL ================= */
    [ErrorCode.SOCIAL.NOT_FRIEND]: 'Not friend',
    [ErrorCode.SOCIAL.REQUEST_SENT]: 'Friend request already sent',
    [ErrorCode.SOCIAL.ALREADY_LIKED]: 'Already liked',
};
