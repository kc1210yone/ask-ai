import type { Document } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export const getDocument = async (
  documentId: string,
  projectId: string,
): Promise<Document | null> => {
  return prisma.document.findFirst({
    where: { id: documentId, projectId },
  });
};
