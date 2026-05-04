import 'dotenv/config';
import assert from 'node:assert/strict';
import { prisma } from '@internal/db/index.js';
import type { Context } from 'aws-lambda';
import { z } from 'zod';
import { syncDocuments } from './documents.js';
import { syncFaqs } from './faqs.js';

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

  await syncDocuments(project.id);
  await syncFaqs(project.id);
};
