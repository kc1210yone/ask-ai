'use server';

import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { revalidatePath } from 'next/cache';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const deleteDocument = async (
  projectId: string,
  documentId: string,
): Promise<ActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    return { status: 'error' };
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!document || document.projectId !== projectId) {
    return { status: 'error' };
  }

  await prisma.document.update({
    where: { id: documentId },
    data: { deletedAt: new Date() },
  });

  revalidatePath(`/projects/${projectId}/documents`);

  return { status: 'ok' };
};
