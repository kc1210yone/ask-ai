import { redirect } from 'next/navigation';
import { AppSidebar } from './app-sidebar';
import type { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '#src/components/ui/sidebar';
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
  const user = await findUser(authUser.userId);
  if (!user) {
    // /users/createの時
    return children;
  }

  let project = null;
  if (projectId) {
    project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!project || project.userId !== user.id) {
      redirect('/');
    }
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <SidebarProvider>
      <AppSidebar project={project} projects={projects} />
      <div className="relative flex-1">
        <SidebarTrigger className="absolute top-0 left-0" />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </div>
    </SidebarProvider>
  );
};
