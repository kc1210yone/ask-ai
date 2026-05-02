import 'server-only';
import { prisma } from '@internal/db/prisma.js';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { Button } from '#src/components/ui/button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

export const RootPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const projects = await prisma.project.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  if (projects.length === 0) {
    redirect('/projects/create');
  }

  if (projects.length === 1) {
    const project = projects[0];
    invariant(project);
    redirect(`/projects/${project.id}/dashboard`);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">プロジェクトを選択</h2>
      <p className="text-muted-foreground">
        これから操作するプロジェクトを選択してください。
      </p>
      <div className="grid gap-4">
        {projects.map((project) => (
          <Button key={project.id} variant={'outline'} asChild>
            <Link href={`/projects/${project.id}/dashboard`}>
              {project.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
