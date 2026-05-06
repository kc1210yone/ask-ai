import type { RequestHandler } from 'express';
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

  // TODO
  console.log('a');
  let message;
  try {
    message = await waitForPost(params.sessionId);
  } catch {
    sseResponse.sendEvent('error', { error: 'post-timeout' });
    sseResponse.end();
    return;
  }
  console.log('b');
  console.log(message);

  const textChunks = await invokeAgent(message, params.sessionId);

  try {
    for await (const chunk of textChunks) {
      sseResponse.sendEvent('text', { chunk });
    }
  } catch {
    sseResponse.sendEvent('error', { error: 'Error.' });
  }
  sseResponse.sendEvent('done', {});
  sseResponse.end();
};

const waitForPost = async (sessionId: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const eventName = `chat.post.${sessionId}`;

    const handler = ({ message }: { message: string }): void => {
      clearTimeout(timeoutId);
      resolve(message);
    };

    const timeoutId = setTimeout(() => {
      eventEmitter.removeListener(eventName, handler);
      reject(new Error('Timeout'));
    }, 5_000);

    eventEmitter.once(eventName, handler);
  });
};
