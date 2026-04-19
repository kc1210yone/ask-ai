'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ProjectFormSchema, type ProjectActionState } from '../types';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

export const createProject = async (
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> => {
  const parsed = ProjectFormSchema.safeParse({
    name: formData.get('name'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  await prisma.project.create({
    data: { name: parsed.data.name, userId: user.id },
  });

  redirect('/');
};

export const updateProject = async (
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> => {
  const parsed = ProjectFormSchema.safeParse({
    name: formData.get('name'),
  });

  if (!parsed.success) {
    return { errors: z.flattenError(parsed.error).fieldErrors };
  }

  const user = await findOrCreateCurrentUser();
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) redirect('/');

  await prisma.project.update({
    where: { id: projectId },
    data: { name: parsed.data.name },
  });

  revalidatePath(`/projects/${projectId}`);
  redirect(`/?projectId=${projectId}`);
};

export const deleteProject = async (projectId: string): Promise<void> => {
  const user = await findOrCreateCurrentUser();
  await prisma.project.deleteMany({
    where: { id: projectId, userId: user.id },
  });
  revalidatePath('/');
  redirect('/');
};
