'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const deleteFaq = async (faqId: string): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const faq = await prisma.faq.findUnique({
    where: { id: faqId },
    include: { project: true },
  });
  if (faq?.project.userId !== user.id) {
    return { status: 'error' };
  }
  await prisma.faq.delete({ where: { id: faqId } });
  revalidatePath(`/projects/${faq.projectId}/dashboard`);
  return { status: 'ok' };
};
