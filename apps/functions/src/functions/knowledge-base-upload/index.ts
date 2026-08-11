import assert from 'node:assert/strict';
import { prisma } from '@internal/rdb/index.js';
import type { Context } from 'aws-lambda';
import { z } from 'zod';
import { syncDocuments } from './documents.js';
import { syncFaqs } from './faqs.js';
import { logger } from '#src/lib/logger/index.js';

const EventSchema = z.object({
  projectId: z.string(),
});

export const handler = async (
  event: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<void> => {
  const parsedEvent = EventSchema.parse(event);

  const project = await prisma.project.findUnique({
    where: {
      id: parsedEvent.projectId,
      deletedAt: null,
    },
  });
  assert(project);

  const updateResult = await prisma.project.updateMany({
    data: { knowledgeBaseIsUploading: true },
    where: { id: project.id, knowledgeBaseIsUploading: false },
  });
  if (updateResult.count === 0) {
    return;
  }

  try {
    await syncDocuments(project.id);
    await syncFaqs(project.id);

    await prisma.project.update({
      data: {
        knowledgeBaseLastUploadDateTime: new Date(),
      },
      where: { id: project.id },
    });
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.project.update({
      data: {
        knowledgeBaseIsUploading: false,
      },
      where: { id: project.id },
    });
  }
};
