'use client';

import { useTransition } from 'react';
import { deleteProject } from '../actions';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
}

export const DeleteProjectButton = ({ projectId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (
      !confirm(
        'このプロジェクトを削除しますか？関連するDocumentとFAQも削除されます。',
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteProject(projectId);
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? '削除中...' : '削除'}
    </Button>
  );
};
