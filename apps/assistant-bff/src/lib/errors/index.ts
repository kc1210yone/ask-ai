export class HttpError extends Error {
  statusCode: number;

  constructor({
    statusCode,
    message,
    cause,
  }: {
    statusCode: number;
    message: string;
    cause?: unknown;
  }) {
    super(message, { cause });
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}
