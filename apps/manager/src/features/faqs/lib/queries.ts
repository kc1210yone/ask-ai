import type { Faq } from '#src/generated/prisma/client';
import { prisma } from '#src/lib/prisma';

export const getFaq = async (
  faqId: string,
  projectId: string,
): Promise<Faq | null> => {
  return prisma.faq.findFirst({
    where: { id: faqId, projectId },
  });
};
