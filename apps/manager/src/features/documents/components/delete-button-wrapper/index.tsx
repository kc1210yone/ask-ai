'use client';

import 'client-only';
import type { ReactNode } from 'react';
import { deleteDocument } from './actions';
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
  documentId: string;
  preDelete?: (() => void | Promise<void>) | undefined;
  postDelete?: ((status: 'ok' | 'error') => void | Promise<void>) | undefined;
  children: ReactNode;
}

export const DeleteButtonWrapper = ({
  projectId,
  documentId,
  preDelete,
  postDelete,
  children,
}: Props): ReactNode => {
  const onAction = async (): Promise<void> => {
    await preDelete?.();
    let status: 'ok' | 'error';
    try {
      const response = await deleteDocument(projectId, documentId);
      status = response.status;
    } catch {
      status = 'error';
    }
    await postDelete?.(status);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ドキュメントを削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            このドキュメントは削除されます。
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
