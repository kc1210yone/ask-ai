import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#src/components/ui/sidebar';

interface Props {
  projectId: string | null;
}

export const AppSidebar = ({ projectId }: Props): ReactNode => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {projectId && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${projectId}/update`}>
                    <SettingsIcon />
                    <span>プロジェクト設定</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
