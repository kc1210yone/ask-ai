import type { RequestHandler } from 'express';
import { z } from 'zod';
import { eventEmitter } from './event.js';
import { HttpError } from '#src/lib/errors/index.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
  inputMessage: z.string().min(1),
});

export const postChatHandler: RequestHandler = (request, response) => {
  const parseResult = ParamsSchema.safeParse({
    ...request.params,
    ...request.query,
    ...request.body,
  });
  if (!parseResult.success) {
    throw new HttpError({ statusCode: 400, message: 'Bad Request' });
  }
  const params = parseResult.data;

  eventEmitter.emit(`chat.post.${params.sessionId}`, {
    inputMessage: params.inputMessage,
  });

  response.json({ status: 'ok' });
};
