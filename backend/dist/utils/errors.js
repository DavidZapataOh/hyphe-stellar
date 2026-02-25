export class AppError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 500, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AppError";
    }
}
export class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}
export class ContractError extends AppError {
    constructor(method, detail) {
        super(`Contract call failed: ${method}${detail ? ` — ${detail}` : ""}`, 502, "CONTRACT_ERROR");
        this.name = "ContractError";
    }
}
//# sourceMappingURL=errors.js.map