import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';
import { findProjects, type SideBarProject } from './actions';
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
  projectId: string | null;
}

export const AppSidebarHeader = ({ projectId }: Props): ReactNode => {
  const [projects, setProjects] = useState<SideBarProject[] | null>(null);

  const fetchProjects = async (): Promise<void> => {
    const response = await findProjects();
    if (response.status === 'error') {
      return;
    }
    invariant(response.projects);
    setProjects(response.projects);
    console.log(response.projects);
  };
  useEffect(() => {
    void fetchProjects();
  }, []);

  return (
    <SidebarHeader>
      <h1>Ask AI 管理画面</h1>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                Select Workspace
                <ChevronDownIcon className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
              {projects?.map((project) => (
                <DropdownMenuItem key={project.id}>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
