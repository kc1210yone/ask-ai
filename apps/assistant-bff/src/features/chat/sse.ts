import type { Response } from 'express';

export const initializeSseResponse = (response: Response): void => {
  response.socket?.setNoDelay(true);
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders();
};

export const sendSseTextEvent = (response: Response, chunk: string): void => {
  response.write(`event: text\ndata: ${JSON.stringify({ chunk })}\n\n`);
};

export const sendSseDoneEvent = (
  response: Response,
  sessionId: string,
): void => {
  response.write(`event: done\ndata: ${JSON.stringify({ sessionId })}\n\n`);
};

export const sendSseErrorEvent = (response: Response, error: string): void => {
  response.write(`event: error\ndata: ${JSON.stringify({ error })}\n\n`);
};
