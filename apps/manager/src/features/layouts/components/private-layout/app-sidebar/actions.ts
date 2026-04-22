'use server';

import type { Project } from '#src/generated/prisma/client';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

export type SideBarProject = Pick<Project, 'id' | 'name'>;

interface FindProjectsResponse {
  status: 'ok' | 'error';
  projects: SideBarProject[] | null;
}

export const findProjects = async (): Promise<FindProjectsResponse> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const projects = await prisma.project.findMany({
    select: { id: true, name: true },
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });
  return { status: 'ok', projects };
};
