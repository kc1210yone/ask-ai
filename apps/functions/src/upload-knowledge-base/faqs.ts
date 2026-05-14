import assert from 'node:assert/strict';
import type { Faq } from '@internal/rdb/generated/prisma/client.js';
import { prisma } from '@internal/rdb/index.js';
import {
  deleteObjects,
  listObjects,
  putObject,
  type ListObjectsItem,
} from './s3-client.js';

export const syncFaqs = async (projectId: string): Promise<void> => {
  const faqs = await prisma.faq.findMany({
    where: {
      projectId: projectId,
      deletedAt: null,
    },
  });

  const s3Objects = await listObjects(`${projectId}/faqs/`);

  await putFaqObjects(projectId, faqs, s3Objects);
  await deleteFaqObjects(faqs, s3Objects);
};

const putFaqObjects = async (
  projectId: string,
  faqs: Faq[],
  s3Objects: Record<string, ListObjectsItem>,
): Promise<void> => {
  for (const faq of faqs) {
    const s3Key = `${projectId}/faqs/${faq.id}.txt`;
    const s3MetadataKey = `${s3Key}.metadata.json`;

    const s3Object = s3Objects[s3Key];
    const s3MetadataObject = s3Objects[s3MetadataKey];

    if (s3Object && s3Object.lastModified > faq.updatedAt && s3MetadataObject) {
      continue;
    }

    const body =
      `
--- Question ---
${faq.question}

--- Answer ---
${faq.answer}
`.trim() + '\n';
    await putObject(s3Key, body);

    const metadata = {
      metadataAttributes: {
        projectId,
      },
    };
    await putObject(s3MetadataKey, JSON.stringify(metadata));
  }
};

const deleteFaqObjects = async (
  faqs: Faq[],
  s3Objects: Record<string, ListObjectsItem>,
): Promise<void> => {
  const deletedKeys = Object.keys(s3Objects).filter((key) => {
    const keyFaqId = key.split('/').at(-1)?.split('.').at(0);
    assert(keyFaqId);
    return !faqs.some((d) => d.id === keyFaqId);
  });
  await deleteObjects(deletedKeys);
};
