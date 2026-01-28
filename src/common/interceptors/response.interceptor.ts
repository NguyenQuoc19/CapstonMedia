import { map } from 'rxjs/operators';
import { ApiResponse } from '@/shared/response/interfaces/api-response.interface';

import {
    Injectable,
    CallHandler,
    NestInterceptor,
    ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler) {
        return next.handle().pipe(
            map((response) => {
                if (
                    response &&
                    typeof response === 'object' &&
                    'success' in response &&
                    'data' in response
                ) {
                    return response;
                }

                return {
                    data: response,
                    success: true,
                    message: 'Operation successful',
                };
            }),
        );
    }
}
