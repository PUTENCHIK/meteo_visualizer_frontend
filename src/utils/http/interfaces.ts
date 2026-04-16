import type { ErrorCode } from './types';

export interface ApiErrorResponse {
    detail: {
        code: ErrorCode;
        message: string;
    };
}
