import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarTrigger } from '#src/components/ui/sidebar';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

interface Props {
  projectId: string | null;
  children: ReactNode;
}

export const PrivateWithUserLayout = async ({
  projectId,
  children,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  let project = null;
  if (projectId) {
    project = await prisma.project.findUnique({
      where: { id: projectId, deletedAt: null },
    });
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    if (!project || project.userId !== user.id) {
      serverLogger.warn('Invalid project.');
      notFound();
    }
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id, deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <SidebarProvider>
      <AppSidebar project={project} projects={projects} authUser={authUser} />
      <div className="min-w-0 flex-1">
        <div className="bg-background sticky top-0 flex h-18 items-center border-b">
          <SidebarTrigger />
        </div>
        <main className="container mx-auto p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
};
