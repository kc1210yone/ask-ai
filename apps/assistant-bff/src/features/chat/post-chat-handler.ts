import type { RequestHandler } from 'express';
import { z } from 'zod';
import { eventEmitter } from './event.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
  message: z.string().min(1),
});

export const postChatHandler: RequestHandler = (request, response) => {
  const parseResult = ParamsSchema.safeParse({
    ...request.params,
    ...request.query,
    ...request.body,
  });
  if (!parseResult.success) {
    response.status(400).json({ error: 'Bad Request' });
    return;
  }
  const params = parseResult.data;

  eventEmitter.emit(`chat.post.${params.sessionId}`, {
    message: params.message,
  });

  response.json({ status: 'ok' });
};
