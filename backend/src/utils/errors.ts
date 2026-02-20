export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ContractError extends AppError {
  constructor(method: string, detail?: string) {
    super(
      `Contract call failed: ${method}${detail ? ` — ${detail}` : ""}`,
      502,
      "CONTRACT_ERROR"
    );
    this.name = "ContractError";
  }
}
