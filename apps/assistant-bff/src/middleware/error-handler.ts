import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
) => {
  console.error('Unhandled error:', error);
  response.status(500).json({ error: 'Internal server error' });
};
