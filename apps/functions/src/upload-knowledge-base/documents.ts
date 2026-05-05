import assert from 'node:assert/strict';
import type { Document } from '@internal/db/generated/prisma/client.js';
import { prisma } from '@internal/db/index.js';
import {
  deleteObjects,
  listObjects,
  putObject,
  type ListObjectsItem,
} from './s3-client.js';

export const syncDocuments = async (projectId: string): Promise<void> => {
  const documents = await prisma.document.findMany({
    where: {
      projectId: projectId,
      deletedAt: null,
    },
  });

  const s3Objects = await listObjects(`${projectId}/documents/`);

  await putDocumentObjects(projectId, documents, s3Objects);
  await deleteDocumentObjects(documents, s3Objects);
};

const putDocumentObjects = async (
  projectId: string,
  documents: Document[],
  s3Objects: Record<string, ListObjectsItem>,
): Promise<void> => {
  for (const document of documents) {
    const s3Key = `${projectId}/documents/${document.id}.txt`;
    const s3MetadataKey = `${s3Key}.metadata.json`;

    const s3Object = s3Objects[s3Key];
    const s3MetadataObject = s3Objects[s3MetadataKey];

    if (
      s3Object &&
      s3Object.lastModified > document.updatedAt &&
      s3MetadataObject
    ) {
      continue;
    }

    await putObject(s3Key, document.content);

    const metadata = {
      metadataAttributes: {
        projectId,
      },
    };
    await putObject(s3MetadataKey, JSON.stringify(metadata));
  }
};

const deleteDocumentObjects = async (
  documents: Document[],
  s3Objects: Record<string, ListObjectsItem>,
): Promise<void> => {
  const deletedKeys = Object.keys(s3Objects).filter((key) => {
    const keyDocumentId = key.split('/').at(-1)?.split('.').at(0);
    assert(keyDocumentId);
    return !documents.some((d) => d.id === keyDocumentId);
  });
  await deleteObjects(deletedKeys);
};
