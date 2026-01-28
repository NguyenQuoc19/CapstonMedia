import { ErrorMessageMap } from '../maps/error-message.map';

export function getErrorMessage(code: string): string {
    return ErrorMessageMap[code] ?? 'Unexpected error';
}
