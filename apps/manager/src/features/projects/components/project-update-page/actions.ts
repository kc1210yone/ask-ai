'use server';

import 'server-only';
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
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    return { status: 'error' };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name: formData.name,
    },
  });

  revalidatePath(`/projects/${projectId}/dashboard`);

  return {
    status: 'ok',
  };
};
