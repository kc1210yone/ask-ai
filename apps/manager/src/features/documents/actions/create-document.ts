'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  CreateDocumentRequestSchema,
  type CreateDocumentResponse,
} from '../types/create-document';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const createDocument = async (
  projectId: string,
  formData: FormData,
): Promise<CreateDocumentResponse> => {
  const parseResult = CreateDocumentRequestSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!parseResult.success) {
    return { status: 'error', errorMessage: 'Failed to parse request.' };
  }
  const parsedData = parseResult.data;

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.document.create({
    data: { title: parsedData.title, content: parsedData.content, projectId },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};
