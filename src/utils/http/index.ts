export type ErrorCode =
    | 'INTERNAL_ERROR'
    | 'INVALID_CREDENTIALS'
    | 'TOKEN_EXPIRED'
    | 'TOKEN_INVALID'
    | 'HTTP_ERROR'
    | 'VALIDATION';

export interface ApiErrorResponse {
    detail: {
        code: ErrorCode;
        message: string;
    };
}
