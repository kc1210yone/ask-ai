'use server';

import 'server-only';
import { prisma } from '@internal/db/index.js';
import { revalidatePath } from 'next/cache';
import { FormSchema, type FormSchemaType } from './types';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface ActionResponse {
  status: 'ok' | 'error';
  projectId: string | null;
}

export const formAction = async (
  formData: FormSchemaType,
): Promise<ActionResponse> => {
  if (!FormSchema.safeParse(formData).success) {
    return {
      status: 'error',
      projectId: null,
    };
  }

  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.create({
    data: { userId: user.id, name: formData.name },
  });

  revalidatePath('/');

  return {
    status: 'ok',
    projectId: project.id,
  };
};
