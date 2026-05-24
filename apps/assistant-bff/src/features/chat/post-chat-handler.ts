import type { RequestHandler } from 'express';
import { z } from 'zod';
import { invokeAgent } from './bedrock-client.js';
import { SseResponse } from './sse.js';
import { HttpError } from '#src/lib/errors/index.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
  inputMessage: z.string().min(1),
});

export const postChatHandler: RequestHandler = async (request, response) => {
  const parseResult = ParamsSchema.safeParse({
    ...request.params,
    ...request.query,
    ...request.body,
  });
  if (!parseResult.success) {
    throw new HttpError({ statusCode: 400, message: 'Bad Request' });
  }
  const params = parseResult.data;

  const sseResponse = new SseResponse(response);

  sseResponse.initialize();

  const outputMessageChunks = await invokeAgent(
    params.sessionId,
    params.inputMessage,
  );

  for await (const chunk of outputMessageChunks) {
    sseResponse.sendEvent('output-message', { chunk });
  }

  sseResponse.sendEvent('done', {});
  sseResponse.end();
};
