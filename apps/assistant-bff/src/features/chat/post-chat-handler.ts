import { prisma } from '@internal/rdb/index.js';
import type { RequestHandler } from 'express';
import { z } from 'zod';
import { invokeAgent } from './bedrock-client.js';
import { SseResponse } from './sse.js';
import { HttpError } from '#src/lib/errors/index.js';

const ParamsSchema = z.object({
  sessionId: z.uuid(),
  projectId: z.string().min(1),
  inputMessage: z.string().min(1),
});

export const postChatHandler: RequestHandler = async (request, response) => {
  const parseResult = ParamsSchema.safeParse({
    ...request.params,
    ...request.query,
    ...request.body,
  });
  if (!parseResult.success) {
    throw new HttpError({ statusCode: 400, message: 'Invalid params.' });
  }
  const params = parseResult.data;

  const project = await prisma.project.findUnique({
    where: { id: params.projectId, deletedAt: null },
  });
  if (!project) {
    throw new HttpError({ statusCode: 400, message: 'Invalid project.' });
  }

  const updateResult = await prisma.project.updateMany({
    where: {
      id: params.projectId,
      chatCount: {
        lt: 1000,
      },
    },
    data: {
      chatCount: {
        increment: 1,
      },
    },
  });
  if (updateResult.count === 0) {
    throw new HttpError({
      statusCode: 429,
      message: 'Reached chat count limit.',
    });
  }

  const sseResponse = new SseResponse(response);

  sseResponse.initialize();

  const outputMessageChunks = await invokeAgent(
    params.sessionId,
    params.projectId,
    params.inputMessage,
  );

  for await (const chunk of outputMessageChunks) {
    sseResponse.sendEvent('output-message', { chunk });
  }

  sseResponse.sendEvent('done', {});
  sseResponse.end();
};
