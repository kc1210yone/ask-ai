import { PlusIcon, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { ThemeSelector } from './theme-selector';
import type { ReactNode } from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#src/components/ui/sidebar';

interface Props {
  projectId: string | null;
}

export const AppSidebarContent = ({ projectId }: Props): ReactNode => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>プロジェクト</SidebarGroupLabel>
        <SidebarGroupAction>
          <PlusIcon />
        </SidebarGroupAction>
        <SidebarGroupContent>content</SidebarGroupContent>
      </SidebarGroup>
      <ThemeSelector />
      <LogoutButton />
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
  );
};
