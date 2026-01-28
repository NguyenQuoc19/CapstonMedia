import { ApiError } from "./api-error.interface";

export interface ErrorResponse {
    // error: ApiError;
    success: boolean;
    message: string;
    error_code: string;
}
