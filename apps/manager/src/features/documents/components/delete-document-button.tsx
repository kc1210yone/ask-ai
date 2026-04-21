'use client';

import { useTransition } from 'react';
import { deleteDocument } from '../actions/delete-document';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  documentId: string;
}

export const DeleteDocumentButton = ({ projectId, documentId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm('このDocumentを削除しますか？')) return;
    startTransition(async () => {
      await deleteDocument(projectId, documentId);
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
