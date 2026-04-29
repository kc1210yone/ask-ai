'use client';

import 'client-only';
import type { ReactNode } from 'react';
import { deleteFaq } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#src/components/ui/alert-dialog';

interface Props {
  projectId: string;
  faqId: string;
  preDelete?: (() => void | Promise<void>) | undefined;
  postDelete?: ((status: 'ok' | 'error') => void | Promise<void>) | undefined;
  children: ReactNode;
}

export const DeleteButtonWrapper = ({
  projectId,
  faqId,
  preDelete,
  postDelete,
  children,
}: Props): ReactNode => {
  const onAction = async (): Promise<void> => {
    await preDelete?.();
    const response = await deleteFaq(projectId, faqId);
    await postDelete?.(response.status);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>FAQを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            このFAQは削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => void onAction()}
          >
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
