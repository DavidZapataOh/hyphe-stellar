export declare class AppError extends Error {
    statusCode: number;
    code?: string | undefined;
    constructor(message: string, statusCode?: number, code?: string | undefined);
}
export declare class NotFoundError extends AppError {
    constructor(resource: string);
}
export declare class ContractError extends AppError {
    constructor(method: string, detail?: string);
}
