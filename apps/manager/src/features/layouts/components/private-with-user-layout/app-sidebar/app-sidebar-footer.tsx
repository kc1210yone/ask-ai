'use client';

import { signOut } from 'aws-amplify/auth';
import { LogOutIcon, UserCogIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '#src/features/auth';
import type { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#src/components/ui/dropdown-menu';
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#src/components/ui/sidebar';

interface Props {
  authUser: AuthUser;
}

export const AppSidebarFooter = ({ authUser }: Props): ReactNode => {
  const router = useRouter();

  const logout = async (): Promise<void> => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton asChild>
              <DropdownMenuTrigger>
                <UserIcon />
                <span className="truncate">{authUser.username}</span>
              </DropdownMenuTrigger>
            </SidebarMenuButton>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              <DropdownMenuItem asChild>
                <Link href="/users/update">
                  <UserCogIcon />
                  アカウント設定
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void logout()}>
                <LogOutIcon />
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
