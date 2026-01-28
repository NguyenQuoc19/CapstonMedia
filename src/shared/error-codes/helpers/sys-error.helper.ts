import { HttpStatus } from '@nestjs/common';
import { SysErrorCode } from '@/shared/error-codes/constants/sys.error';

export function generateSysErrorCode(
    status: HttpStatus,
): SysErrorCode {
    return `SYS_${status}`;
}
