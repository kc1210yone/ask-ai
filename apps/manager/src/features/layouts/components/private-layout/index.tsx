import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LogoutButton } from './logout-button';
import { ProjectSelector } from './project-selector';
import type { ReactNode } from 'react';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUser } from '#src/features/users';
import { prisma } from '#src/lib/prisma';

interface Props {
  projectId: string | null;
  children: ReactNode;
}

export const PrivateLayout = async ({
  projectId,
  children,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  // /users/createの時だけuserはnull。
  const user = await findUser(authUser.userId);

  let project = null;
  if (projectId && user) {
    project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!project || project.userId !== user.id) {
      redirect('/');
    }
  }

  const projects = user
    ? await prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      })
    : null;

  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex-none">
              <h1 className="font-semibold">Ask AI 管理画面</h1>
            </Link>
            <ProjectSelector
              projectId={projectId}
              projects={projects}
              className="flex-none"
            />
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
};
