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

chatRouter.post('/chat', async (request, response) => {
  const parsedBody = ChatRequestBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  const { message, sessionId } = parsedBody.data;

  const invokeResult = await invokeAgent(message, sessionId);
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
