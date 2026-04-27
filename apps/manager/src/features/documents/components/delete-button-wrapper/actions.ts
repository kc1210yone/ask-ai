'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

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
    where: { id: projectId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    return { status: 'error' };
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!document || document.projectId !== projectId) {
    return { status: 'error' };
  }

  // TODO: 論理削除にする
  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath(`/projects/${projectId}/documents`);

  return { status: 'ok' };
};
