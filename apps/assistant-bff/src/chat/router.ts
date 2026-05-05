import { Router } from 'express';
import { z } from 'zod';
import { invokeAgent } from '#src/chat/invoke-agent.js';
import {
  initializeSseResponse,
  sendSseDoneEvent,
  sendSseErrorEvent,
  sendSseTextEvent,
} from '#src/chat/sse.js';

export const chatRouter = Router();

const ChatRequestBodySchema = z.object({
  message: z.string().min(1),
  sessionId: z.string().optional(),
});

chatRouter.post('/chat', async (request, response) => {
  const parsedBody = ChatRequestBodySchema.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      error: 'Invalid request body',
      details: parsedBody.error.issues,
    });
    return;
  }

  const { message, sessionId } = parsedBody.data;

  const invokeResult = await invokeAgent(message, sessionId);

  if (invokeResult.isErr()) {
    response.status(502).json({ error: invokeResult.error });
    return;
  }

  const { sessionId: resolvedSessionId, textChunks } = invokeResult.value;

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
