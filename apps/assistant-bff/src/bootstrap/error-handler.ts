import type { ErrorRequestHandler } from 'express';
import { HttpError } from '#src/lib/errors/index.js';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
) => {
  console.error(error);

  if (response.headersSent) {
    console.error('Headers are already sent, so cannot send error response.');
    response.end();
    return;
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.message,
    });
  } else {
    response.status(500).json({ error: 'Internal Server Error' });
  }
};
