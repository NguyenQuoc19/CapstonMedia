import { HttpStatus } from '@nestjs/common';

export type SysErrorCode = `SYS_${HttpStatus}`;
