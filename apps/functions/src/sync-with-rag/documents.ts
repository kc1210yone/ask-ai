import { prisma } from '@internal/db/index.js';
import { listObjects } from './s3-wrapper.js';

export const syncDocuments = async (projectId: string): Promise<void> => {
  const documents = await prisma.document.findMany({
    where: {
      projectId: projectId,
      deletedAt: null,
    },
  });

  const s3Documents = await listObjects(`${projectId}/documents/`);

  const dbDocKeys = new Set<string>();
  for (const doc of documents) {
    const key = `${projectId}/documents/${doc.id}.txt`;
    dbDocKeys.add(key);
    const s3LastModified = s3Documents.get(key);
    if (!s3LastModified || doc.updatedAt > s3LastModified) {
      await putObject(key, `${doc.title}\n\n${doc.content}`);
    }
  }

  // Delete S3 documents that no longer exist in DB
  for (const key of s3Documents.keys()) {
    if (!dbDocKeys.has(key)) {
      await deleteObject(key);
    }
  }
};
