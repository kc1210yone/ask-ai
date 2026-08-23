import 'server-only';
import type { Project } from '@internal/rdb/generated/prisma/client.js';
import { type ReactNode } from 'react';
import { AppSidebarContent } from './app-sidebar-content';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarHeader } from './app-sidebar-header';
import { CloseMobileSidebarOnNavigate } from './close-mobile-sidebar-on-navigate';
import { Sidebar, SidebarRail } from '#src/components/ui/sidebar';
import type { AuthUser } from '#src/features/auth';

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
      <CloseMobileSidebarOnNavigate />
      <AppSidebarHeader project={project} projects={projects} />
      <AppSidebarContent projectId={project?.id ?? null} />
      <AppSidebarFooter authUser={authUser} />
      <SidebarRail />
    </Sidebar>
  );
};
