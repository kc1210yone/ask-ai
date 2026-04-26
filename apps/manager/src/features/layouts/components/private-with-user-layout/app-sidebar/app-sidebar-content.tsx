'use client';

import {
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
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>プロジェクト</SidebarGroupLabel>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarGroupAction asChild>
              <Link href={`/projects/create`}>
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
                  <Link href={`/projects/${projectId}/dashboard`}>
                    <LayoutDashboardIcon />
                    <span>ダッシュボード</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${projectId}/documents`}>
                    <FileIcon />
                    <span>ドキュメント</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${projectId}/faqs`}>
                    <FileQuestionMarkIcon />
                    <span>FAQ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${projectId}/update`}>
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
