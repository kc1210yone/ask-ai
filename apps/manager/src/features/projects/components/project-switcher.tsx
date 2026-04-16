'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteProject } from '../actions';
import type { Project } from '#src/generated/prisma/client';
import { Button } from '#src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#src/components/ui/select';

interface Props {
  projects: Project[];
}

export const ProjectSwitcher = ({ projects }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathProjectId = /^\/projects\/([^/]+)/.exec(pathname)?.[1];
  const currentProjectId = pathProjectId ?? projects[0]?.id;
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (value: string) => {
    router.push(`/projects/${value}`);
  };

  const handleDelete = () => {
    if (!currentProjectId) return;
    if (
      !confirm(
        'このプロジェクトを削除しますか？関連するDocumentとFAQも削除されます。',
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteProject(currentProjectId);
    });
  };

  if (projects.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-muted-foreground text-sm">
          プロジェクトがありません
        </p>
        <Button size="sm" asChild>
          <Link href="/projects/new">+ 新規作成</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Select
        {...(currentProjectId !== undefined ? { value: currentProjectId } : {})}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder="プロジェクトを選択" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" asChild>
        <Link href="/projects/new">+ 追加</Link>
      </Button>
      {currentProjectId && (
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${currentProjectId}/edit`}>編集</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? '削除中...' : '削除'}
          </Button>
        </>
      )}
    </div>
  );
};
