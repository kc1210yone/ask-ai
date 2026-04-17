'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { DeleteDocumentResponse } from '../types/delete-document';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const deleteDocument = async (
  projectId: string,
  documentId: string,
): Promise<DeleteDocumentResponse> => {
  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};
