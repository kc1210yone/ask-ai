'use client';

import { useParams } from 'next/navigation';
import { type ReactNode } from 'react';
import { AppSidebarContent } from './app-sidebar-content';
import { AppSidebarFooter } from './app-sidebar-footer';
import { AppSidebarHeader } from './app-sidebar-header';
import { Sidebar, SidebarRail } from '#src/components/ui/sidebar';

export const AppSidebar = (): ReactNode => {
  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId ?? null;

  return (
    <Sidebar>
      <AppSidebarHeader projectId={projectId} />
      <AppSidebarContent projectId={projectId} />
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
};
