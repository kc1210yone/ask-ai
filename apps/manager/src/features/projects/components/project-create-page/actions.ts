'use server';

import { revalidatePath } from 'next/cache';
import { FormSchema, type FormSchemaType } from './types';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface FormActionResponse {
  status: 'ok' | 'error';
  projectId: string | null;
}

export const formAction = async (
  formData: FormSchemaType,
): Promise<FormActionResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  if (!FormSchema.safeParse(formData).success) {
    return {
      status: 'error',
      projectId: null,
    };
  }
  const project = await prisma.project.create({
    data: { userId: user.id, name: formData.name },
  });
  revalidatePath('/');
  return {
    status: 'ok',
    projectId: project.id,
  };
};
