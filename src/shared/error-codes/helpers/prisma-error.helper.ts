import { HttpStatus } from '@nestjs/common';
import { PrismaErrorMessageMap } from '../maps/prisma-error.message.map';
import { PrismaErrorHttpStatusMap } from '../maps/prisma-error-http.map';

export function getPrismaErrorMessage(code: string): string {
    return PrismaErrorMessageMap[code] ?? 'Database error';
}

export function getPrismaHttpStatus(code: string): HttpStatus {
    return (
        PrismaErrorHttpStatusMap[code] ??
        HttpStatus.INTERNAL_SERVER_ERROR
    );
}