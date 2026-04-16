'use client';

import { useTransition } from 'react';
import { deleteFaq } from '../actions';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  faqId: string;
}

export const DeleteFaqButton = ({ projectId, faqId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm('このFAQを削除しますか？')) return;
    startTransition(async () => {
      await deleteFaq(projectId, faqId);
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
