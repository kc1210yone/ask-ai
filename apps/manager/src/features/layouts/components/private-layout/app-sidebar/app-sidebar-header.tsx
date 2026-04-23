import { ChevronDownIcon } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';
import type { Project } from '#src/generated/prisma/client';
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

interface Props {
  project: Project | null;
  projects: Project[];
}

export const AppSidebarHeader = ({ project, projects }: Props): ReactNode => {
  return (
    <SidebarHeader>
      <Link href="/">
        <h1 className="flex justify-center py-4 text-xl font-semibold">
          Ask AI 管理画面
        </h1>
      </Link>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                {project ? project.name : 'プロジェクトを選択'}
                <ChevronDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/projects/${project.id}/dashboard`}>
                    {project.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
