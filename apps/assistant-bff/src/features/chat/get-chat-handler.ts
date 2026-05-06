import type { RequestHandler } from 'express';
import { err, ok, Result } from 'neverthrow';
import { z } from 'zod';
import { invokeAgent } from './bedrock-client.js';
import { eventEmitter } from './event.js';
import { SseResponse } from './sse.js';
import { HttpError } from '#src/lib/errors/index.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
});

export const getChatHandler: RequestHandler = async (request, response) => {
  const parseResult = ParamsSchema.safeParse(request.params, request.query);
  if (!parseResult.success) {
    throw new HttpError({ statusCode: 400, message: 'Bad Request' });
  }
  const params = parseResult.data;

  const sseResponse = new SseResponse(response);
  sseResponse.initialize();

  sseResponse.sendEvent('ready', {});

  const inputMessageResult = await waitForPost(params.sessionId);
  if (inputMessageResult.isErr()) {
    sseResponse.sendEvent('error', { error: 'input-message-error' });
    sseResponse.end();
    return;
  }
  const inputMessage = inputMessageResult.value;

  const outputMessageChunks = await invokeAgent(params.sessionId, inputMessage);

  for await (const chunk of outputMessageChunks) {
    sseResponse.sendEvent('output-message', { chunk });
  }

  sseResponse.sendEvent('done', {});
  sseResponse.end();
};

const waitForPost = async (
  sessionId: string,
): Promise<Result<string, void>> => {
  return new Promise((resolve) => {
    const eventName = `chat.post.${sessionId}`;

    const handler = ({ inputMessage }: { inputMessage: string }): void => {
      clearTimeout(timeoutId);
      resolve(ok(inputMessage));
    };

    const timeoutId = setTimeout(() => {
      eventEmitter.removeListener(eventName, handler);
      resolve(err());
    }, 5_000);

    eventEmitter.once(eventName, handler);
  });
};
