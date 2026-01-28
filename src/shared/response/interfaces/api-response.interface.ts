import { ResponseMetadata } from "./response-metadata.interface";

export interface ApiResponse<T = any> {
    data: T;
    success: boolean;
    message: string;
    metadata?: ResponseMetadata;
}
