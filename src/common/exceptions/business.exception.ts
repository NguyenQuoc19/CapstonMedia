import { getErrorMessage } from '@/shared/error-codes/helpers/error-message.helper';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(
        code: string,
        status: HttpStatus = HttpStatus.BAD_REQUEST,
        message?: string,
    ) {
        super(
            {
                code,
                message: message ?? getErrorMessage(code),
            },
            status,
        );
    }
}
