'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const deleteDocument = async (
  documentId: string,
): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { project: true },
  });
  if (document?.project.userId !== user.id) {
    return { status: 'error' };
  }
  await prisma.document.delete({ where: { id: documentId } });
  revalidatePath(`/projects/${document.projectId}/dashboard`);
  return { status: 'ok' };
};
