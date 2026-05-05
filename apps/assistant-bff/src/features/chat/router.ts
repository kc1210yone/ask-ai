import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { invokeAgent } from '#src/features/chat/bedrock-client.js';
import {
  initializeSseResponse,
  sendSseDoneEvent,
  sendSseErrorEvent,
  sendSseTextEvent,
} from '#src/features/chat/sse.js';

export const chatRouter = Router();

const ChatRequestBodySchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().nullable(),
});

const StreamQuerySchema = z.object({
  streamId: z.string().min(1),
});

const pendingStreams = new Map<
  string,
  { message: string; sessionId: string | null }
>();

chatRouter.post('/chat', (request, response) => {
  const parsed = ChatRequestBodySchema.safeParse(request.body);

  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid request body' });
    return;
  }

  const streamId = randomUUID();
  pendingStreams.set(streamId, {
    message: parsed.data.message,
    sessionId: parsed.data.sessionId,
  });
  setTimeout(() => {
    pendingStreams.delete(streamId);
  }, 30_000);

  response.json({ streamId });
});

chatRouter.get('/chat/stream', async (request, response) => {
  const parsed = StreamQuerySchema.safeParse(request.query);

  if (!parsed.success) {
    response.status(400).json({ error: 'Invalid query parameters' });
    return;
  }

  const pending = pendingStreams.get(parsed.data.streamId);

  if (!pending) {
    response.status(404).json({ error: 'Stream not found' });
    return;
  }

  pendingStreams.delete(parsed.data.streamId);

  const invokeResult = await invokeAgent(pending.message, pending.sessionId);
  const { sessionId: resolvedSessionId, textChunks } = invokeResult;

  initializeSseResponse(response);

  try {
    for await (const chunk of textChunks) {
      sendSseTextEvent(response, chunk);
    }
  } catch {
    sendSseErrorEvent(response, 'Stream interrupted');
  }

  sendSseDoneEvent(response, resolvedSessionId);
  response.end();
});
