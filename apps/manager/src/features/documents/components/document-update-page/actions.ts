'use server';

import { revalidatePath } from 'next/cache';
import { FormSchema, type FormSchemaType } from './types';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface ActionResponse {
  status: 'ok' | 'error';
}

export const formAction = async (
  projectId: string,
  documentId: string,
  formData: FormSchemaType,
): Promise<ActionResponse> => {
  if (!FormSchema.safeParse(formData).success) {
    return {
      status: 'error',
    };
  }

  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    return {
      status: 'error',
    };
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!document || document.projectId !== project.id) {
    return {
      status: 'error',
    };
  }

  await prisma.document.update({
    where: { id: documentId },
    data: {
      title: formData.title,
      content: formData.content,
    },
  });

  revalidatePath(`/projects/${projectId}/documents`);

  return {
    status: 'ok',
  };
};
