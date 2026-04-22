'use client';

import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Project } from '#src/generated/prisma/client';
import type { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#src/components/ui/select';
import { cn } from '#src/lib/utils';

interface Props {
  projectId: string | null;
  projects: Project[] | null;
  className?: string | undefined;
}

export const ProjectSelector = ({
  projectId,
  projects,
  className,
}: Props): ReactNode => {
  const router = useRouter();

  const onValueChange = (value: string) => {
    if (value === '@create') {
      router.push('/projects/create');
      return;
    }
    router.push(`/projects/${value}/dashboard`);
  };

  return (
    <Select
      value={projectId ?? ''}
      onValueChange={onValueChange}
      disabled={!projects || projects.length === 0}
    >
      <SelectTrigger className={cn('w-full max-w-48', className)}>
        <SelectValue placeholder="プロジェクトを選択" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>プロジェクト</SelectLabel>
          {projects?.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectItem value="@create">
            <PlusIcon className="size-4" />
            新規作成
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
