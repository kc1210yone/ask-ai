'use client';

import { ChevronDownIcon, FolderIcon, FolderPlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#src/components/ui/dropdown-menu';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#src/components/ui/sidebar';
import type { Project } from '#src/generated/prisma/client';

interface Props {
  project: Project | null;
  projects: Project[];
}

export const AppSidebarHeader = ({ project, projects }: Props): ReactNode => {
  const router = useRouter();

  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId ?? null;

  useEffect(() => {
    router.refresh();
  }, [projectId, router]);

  return (
    <SidebarHeader>
      <Link href="/">
        <h1 className="flex h-16 items-center justify-center border-b text-xl font-semibold">
          Ask AI 管理画面
        </h1>
      </Link>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton asChild>
              <DropdownMenuTrigger>
                <FolderIcon />
                {project ? project.name : 'プロジェクトを選択'}
                <ChevronDownIcon className="ml-auto" />
              </DropdownMenuTrigger>
            </SidebarMenuButton>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/projects/${project.id}/dashboard`}>
                    <FolderIcon />
                    {project.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem key="@create" asChild>
                <Link href={`/projects/create`}>
                  <FolderPlusIcon />
                  新規作成
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
