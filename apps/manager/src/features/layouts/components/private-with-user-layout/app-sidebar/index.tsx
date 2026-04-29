import 'server-only';
import { type ReactNode } from 'react';
import { AppSidebarContent } from './app-sidebar-content';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarHeader } from './app-sidebar-header';
import { Sidebar, SidebarRail } from '#src/components/ui/sidebar';
import type { AuthUser } from '#src/features/auth';
import type { Project } from '#src/generated/prisma/client';

interface Props {
  project: Project | null;
  projects: Project[];
  authUser: AuthUser;
}

export const AppSidebar = ({
  project,
  projects,
  authUser,
}: Props): ReactNode => {
  return (
    <Sidebar>
      <AppSidebarHeader project={project} projects={projects} />
      <AppSidebarContent projectId={project?.id ?? null} />
      <AppSidebarFooter authUser={authUser} />
      <SidebarRail />
    </Sidebar>
  );
};
