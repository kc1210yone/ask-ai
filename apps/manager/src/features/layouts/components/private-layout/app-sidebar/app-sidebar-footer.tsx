import { UserIcon } from 'lucide-react';
import { LogoutButton } from './logout-button';
import type { ReactNode } from 'react';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#src/components/ui/sidebar';

export const AppSidebarFooter = (): ReactNode => {
  return (
    <SidebarFooter>
      <LogoutButton />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <UserIcon /> Username
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
