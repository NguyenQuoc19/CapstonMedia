import { HttpStatus } from '@nestjs/common';

export const SysErrorMessageMap: Record<number, string> = {
    [HttpStatus.BAD_REQUEST]: 'Bad request',
    [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatus.FORBIDDEN]: 'Forbidden',
    [HttpStatus.NOT_FOUND]: 'Resource not found',
    [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',
    [HttpStatus.REQUEST_TIMEOUT]: 'Request timeout',
};
