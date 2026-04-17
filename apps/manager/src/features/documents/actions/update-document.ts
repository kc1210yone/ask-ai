'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  UpdateDocumentRequestSchema,
  type UpdateDocumentResponse,
} from '../types/update-document';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const updateDocument = async (
  projectId: string,
  documentId: string,
  formData: FormData,
): Promise<UpdateDocumentResponse> => {
  const parsed = UpdateDocumentRequestSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { status: 'error', errorMessage: '' };
  }

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.document.update({
    where: { id: documentId },
    data: { title: parsed.data.title, content: parsed.data.content },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};
