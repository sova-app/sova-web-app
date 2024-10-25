export class ApiError<T extends object> extends Error {
  public constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code: string,
    public readonly data: T
  ) {
    super(message);
  }
}

export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class HttpError extends Error {
  constructor(message: string, options: ErrorOptions) {
    super(message, options);
  }
}

export class APIError<T = unknown> extends HttpError {
  statusCode: number = 500;
  fatal = false;
  statusMessage?: string;
  data?: T;
  cause?: unknown;
  constructor(message: string, options: { cause?: unknown } = {}) {
    super(message, options);
  }
}

export function createError<T = unknown>(
  input:
    | string
    | (Partial<APIError<T>> & { status?: number; statusText?: string })
): APIError<T> {
  if (input instanceof APIError) {
    return input;
  }

  if (typeof input === "string") {
    return new APIError<T>(input);
  }

  const cause: unknown = input.cause;

  const err = new APIError<T>(input.message ?? input.statusMessage ?? "", {
    cause: cause || input,
  });

  if ("stack" in input) {
    err.stack = input.stack;
  }
  if (input.data) {
    err.data = input.data;
  }

  const statusCode =
    input.statusCode ??
    input.status ??
    (cause as APIError)?.statusCode ??
    (cause as { status?: number })?.status;

  if (typeof statusCode === "number") {
    err.statusCode = statusCode;
  }

  const statusMessage =
    input.statusMessage ??
    input.statusText ??
    (cause as APIError)?.statusMessage ??
    (cause as { statusText?: string })?.statusText;

  if (statusMessage) {
    err.statusMessage = statusMessage;
  }

  const fatal = input.fatal ?? (cause as APIError)?.fatal;
  if (fatal !== undefined) {
    err.fatal = fatal;
  }

  return err;

}
