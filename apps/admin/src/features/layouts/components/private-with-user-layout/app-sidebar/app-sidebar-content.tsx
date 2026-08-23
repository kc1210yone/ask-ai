'use client';

import 'client-only';
import {
  CloudUploadIcon,
  CreditCardIcon,
  FileIcon,
  FileQuestionMarkIcon,
  FolderCogIcon,
  LayoutDashboardIcon,
  PlusIcon,
  SunIcon,
} from 'lucide-react';
import Link from 'next/link';
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
  useSidebar,
} from '#src/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '#src/components/ui/tooltip';
import { ThemeButtonWrapper } from '#src/features/theme';

interface Props {
  projectId: string | null;
}

export const AppSidebarContent = ({ projectId }: Props): ReactNode => {
  const { setOpenMobile } = useSidebar();

  const closeMobileSidebar = (): void => {
    setOpenMobile(false);
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>プロジェクト</SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarGroupAction asChild>
              <Link href={`/projects/create`} onClick={closeMobileSidebar}>
                <PlusIcon />
              </Link>
            </SidebarGroupAction>
          </TooltipTrigger>
          <TooltipContent>
            <p>プロジェクトの新規作成</p>
          </TooltipContent>
        </Tooltip>
        {projectId && (
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/projects/${projectId}/dashboard`}
                    onClick={closeMobileSidebar}
                  >
                    <LayoutDashboardIcon />
                    <span>ダッシュボード</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/projects/${projectId}/documents`}
                    onClick={closeMobileSidebar}
                  >
                    <FileIcon />
                    <span>ドキュメント</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/projects/${projectId}/faqs`}
                    onClick={closeMobileSidebar}
                  >
                    <FileQuestionMarkIcon />
                    <span>FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/projects/${projectId}/knowledge-base/upload`}
                    onClick={closeMobileSidebar}
                  >
                    <CloudUploadIcon />
                    <span>ナレッジベースの反映</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/projects/${projectId}/update`}
                    onClick={closeMobileSidebar}
                  >
                    <FolderCogIcon />
                    <span>プロジェクト設定</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>プラン・請求</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/billing" onClick={closeMobileSidebar}>
                  <CreditCardIcon />
                  <span>プラン・請求</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>テーマ</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <ThemeButtonWrapper>
                <SidebarMenuButton>
                  <SunIcon />
                  テーマ設定
                </SidebarMenuButton>
              </ThemeButtonWrapper>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
