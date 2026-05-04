import type { Faq } from '@internal/db/generated/prisma/client.js';
import { prisma } from '@internal/db/index.js';
import {
  deleteObjects,
  listObjects,
  putObject,
  type ListObjectsItem,
} from './s3-wrapper.js';

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
    const s3Object = s3Objects[s3Key];
    if (s3Object && s3Object.lastModified > faq.updatedAt) {
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
  }
};

const deleteFaqObjects = async (
  faqs: Faq[],
  s3Objects: Record<string, ListObjectsItem>,
): Promise<void> => {
  const deletedKeys = Object.keys(s3Objects).filter((key) => {
    const keyFaqId = key.split('/').at(-1)?.split('.').at(0);
    return !faqs.some((d) => d.id === keyFaqId);
  });
  await deleteObjects(deletedKeys);
};
