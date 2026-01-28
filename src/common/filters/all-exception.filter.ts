import { Prisma } from '@/generated/prisma/client';
import { Response } from 'express';
import { ErrorResponse } from '@/shared/response/interfaces/error-response.interface';
import { generateSysErrorCode, getErrorMessage } from '@/shared/error-codes';
import { getPrismaErrorMessage, getPrismaHttpStatus } from '@/shared/error-codes/helpers/prisma-error.helper';

import {
    Catch,
    Injectable,
    HttpStatus,
    HttpException,
    ArgumentsHost,
    ExceptionFilter,
    GatewayTimeoutException,
} from '@nestjs/common';
import { AxiosError } from 'axios';

const handlePrismaException = (exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) => {
    const res = host.switchToHttp().getResponse<Response>();
    const status = getPrismaHttpStatus(exception.code);
    const errorCode = generateSysErrorCode(status);
    let errorResponse: ErrorResponse = {
        success: false,
        message: getPrismaErrorMessage(exception.code) ?? exception.message,
        error_code: errorCode,
    };

    return res.status(status).json(errorResponse satisfies ErrorResponse);
}

const handleHttpException = (exception: HttpException, host: ArgumentsHost) => {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const response = exception.getResponse();
    const errorCode = generateSysErrorCode(status);

    let errorResponse: ErrorResponse = {
        success: false,
        message: getErrorMessage(errorCode) ?? exception.message,
        error_code: errorCode,
    };

    if (typeof response === 'object' && response !== null) {
        const r = response as any;
        errorResponse = {
            success: false,
            message: r.message ?? getErrorMessage(errorCode) ?? 'Unexpected error',
            error_code: errorCode,
        };
    }

    return res.status(status).json(errorResponse satisfies ErrorResponse);
}

const handelAxiosException = (exception: AxiosError, host: ArgumentsHost) => {
    const res = host.switchToHttp().getResponse<Response>();

    const status = exception.response?.status ?? (
        exception.code === 'ECONNABORTED' ? HttpStatus.GATEWAY_TIMEOUT : HttpStatus.BAD_REQUEST
    );

    const errorCode = generateSysErrorCode(status);
    const message = (exception.response?.data as any)?.message || exception.message || `[Axios]: ${getErrorMessage(errorCode)}`;

    const errorResponse = {
        success: false,
        message: message,
        error_code: errorCode,
    } satisfies ErrorResponse;

    return res.status(status).json(errorResponse);
}


const handelUnknowException = (exception: unknown, host: ArgumentsHost) => {
    const res = host.switchToHttp().getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorCode = generateSysErrorCode(status);

    const errorRepsonse = {
        success: false,
        message: getErrorMessage(errorCode),
        error_code: errorCode,
    }

    return res.status(status).json(errorRepsonse satisfies ErrorResponse);
}

@Injectable()
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        /**
         * Prisma Exception
         */
        if (exception instanceof Prisma.PrismaClientKnownRequestError) return handlePrismaException(exception, host);

        /**
         * AxiosException
        */
        if (exception instanceof AxiosError) return handelAxiosException(exception, host);

        /**
         * HttpException (BadRequestException, UnauthorizedException, BusinessException, ...)
         */
        if (exception instanceof HttpException) return handleHttpException(exception, host);

        /**
         * Unknown / system error
         */
        return handelUnknowException(exception, host);
    }
}
