import { Router } from 'express';
import { z } from 'zod';
import { invokeAgent } from '#src/features/chat/invoke-agent.js';
import {
  initializeSseResponse,
  sendSseDoneEvent,
  sendSseErrorEvent,
  sendSseTextEvent,
} from '#src/features/chat/sse.js';

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

  let chunkCount = 0;
  try {
    for await (const chunk of textChunks) {
      chunkCount++;
      console.log(
        `chunk #${chunkCount.toString()}: ${chunk.length.toString()} chars`,
      );
      sendSseTextEvent(response, chunk);
    }
  } catch {
    sendSseErrorEvent(response, 'Stream interrupted');
  }
  console.log(`total chunks: ${chunkCount.toString()}`);

  sendSseDoneEvent(response, resolvedSessionId);
  response.end();
});
