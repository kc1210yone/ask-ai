import { type ReactNode } from 'react';
import { AppSidebarContent } from './app-sidebar-content';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarHeader } from './app-sidebar-header';
import type { Project } from '#src/generated/prisma/client';
import { Sidebar, SidebarRail } from '#src/components/ui/sidebar';

interface Props {
  project: Project | null;
  projects: Project[];
}

export const AppSidebar = ({ project, projects }: Props): ReactNode => {
  return (
    <Sidebar>
      <AppSidebarHeader project={project} projects={projects} />
      <AppSidebarContent projectId={project?.id ?? null} />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
};
