'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { revalidatePath } from 'next/cache';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const deleteFaq = async (
  projectId: string,
  faqId: string,
): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    serverLogger.warn('Invalid project.');
    return { status: 'error' };
  }

  const faq = await prisma.faq.findUnique({
    where: { id: faqId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!faq || faq.projectId !== projectId) {
    serverLogger.warn('Invalid FAQ.');
    return { status: 'error' };
  }

  await prisma.faq.update({
    where: { id: faqId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/projects/${projectId}/faqs`);

  return { status: 'ok' };
};
