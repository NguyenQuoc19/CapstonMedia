import { ApiResponse } from '../interfaces/api-response.interface';
import { ResponseMetadata } from '../interfaces/response-metadata.interface';

export const successResponse = <T>(
    data: T,
    message = 'Operation successful',
    metadata?: ResponseMetadata,
): ApiResponse<T> => ({
    data,
    success: true,
    message,
    ...(metadata && { metadata }),
});
