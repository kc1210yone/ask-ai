'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { DocumentFormSchema, type DocumentActionState } from '../types';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const createDocument = async (
  projectId: string,
  _prevState: DocumentActionState,
  formData: FormData,
): Promise<DocumentActionState> => {
  const parsed = DocumentFormSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.document.create({
    data: { title: parsed.data.title, content: parsed.data.content, projectId },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};

export const updateDocument = async (
  projectId: string,
  documentId: string,
  _prevState: DocumentActionState,
  formData: FormData,
): Promise<DocumentActionState> => {
  const parsed = DocumentFormSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
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

export const deleteDocument = async (
  projectId: string,
  documentId: string,
): Promise<void> => {
  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.document.delete({ where: { id: documentId } });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};
