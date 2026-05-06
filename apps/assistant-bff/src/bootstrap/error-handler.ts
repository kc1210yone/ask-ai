import type { ErrorRequestHandler, Response } from 'express';
import { HttpError } from '#src/lib/errors/index.js';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
) => {
  console.error(error);

  if (!response.headersSent) {
    whenHeadersNotSent(error, response);
  } else {
    whenHeadersSent(response);
  }
};

const whenHeadersNotSent = (error: unknown, response: Response): void => {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.message,
    });
  } else {
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

const whenHeadersSent = (response: Response): void => {
  if (response.get('Content-Type') === 'text/event-stream') {
    response.write('event: error\n');
    response.write('data: {}\n\n');
  }
  response.end();
};
