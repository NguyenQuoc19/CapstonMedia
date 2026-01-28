import { HttpStatus } from '@nestjs/common';

export const PrismaErrorHttpStatusMap: Record<string, HttpStatus> = {
    // Data errors
    P2000: HttpStatus.BAD_REQUEST,
    P2001: HttpStatus.NOT_FOUND,
    P2002: HttpStatus.BAD_REQUEST,
    P2003: HttpStatus.BAD_REQUEST,
    P2004: HttpStatus.BAD_REQUEST,
    P2010: HttpStatus.BAD_REQUEST,
    P2014: HttpStatus.BAD_REQUEST,
    P2016: HttpStatus.BAD_REQUEST,
    P2019: HttpStatus.BAD_REQUEST,
    P2025: HttpStatus.NOT_FOUND,

    // System errors
    P1000: HttpStatus.INTERNAL_SERVER_ERROR,
    P1001: HttpStatus.SERVICE_UNAVAILABLE,
    P1002: HttpStatus.GATEWAY_TIMEOUT,
    P1003: HttpStatus.INTERNAL_SERVER_ERROR,
    P1008: HttpStatus.GATEWAY_TIMEOUT,
    P1017: HttpStatus.SERVICE_UNAVAILABLE,
};
