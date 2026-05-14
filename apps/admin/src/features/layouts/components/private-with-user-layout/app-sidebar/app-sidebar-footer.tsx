'use client';

import 'client-only';
import { signOut } from 'aws-amplify/auth';
import { KeyIcon, LogOutIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
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
import type { AuthUser } from '#src/features/auth';

interface Props {
  authUser: AuthUser;
}

export const AppSidebarFooter = ({ authUser }: Props): ReactNode => {
  const router = useRouter();

  const logout = async (): Promise<void> => {
    try {
      await signOut();
    } catch {
      toast.error('ログアウトに失敗しました。');
      return;
    }
    router.push('/auth/login');
    toast.success('ログアウトしました。');
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
                <Link href="/users/update-password">
                  <KeyIcon />
                  パスワード変更
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
