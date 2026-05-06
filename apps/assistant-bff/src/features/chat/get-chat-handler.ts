import type { RequestHandler } from 'express';
import { z } from 'zod';
import { invokeAgent } from './bedrock-client.js';
import { eventEmitter } from './event.js';
import { SseResponse } from './sse.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
});

export const getChatHandler: RequestHandler = async (request, response) => {
  const parseResult = ParamsSchema.safeParse(request.params, request.query);
  if (!parseResult.success) {
    response.status(400).json({ error: 'Bad Request' });
    return;
  }
  const params = parseResult.data;

  const sseResponse = new SseResponse(response);

  sseResponse.sendEvent('ready', {});

  const message = waitForMessage(params.sessionId);

  const textChunks = await invokeAgent(message, params.sessionId);

  sseResponse.initialize();
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

const waitForMessage = async (sessionId: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const eventName = `chat.post.${sessionId}`;

    const handler = ({ message }: { message: string }) => {
      clearTimeout(timeoutId);
      resolve(message);
    };

    const timeoutId = setTimeout(() => {
      eventEmitter.off(eventName, handler);
      reject(new Error('Timeout'));
    }, 30_000);

    eventEmitter.once(eventName, handler);
  });
};
