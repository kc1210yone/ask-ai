import 'server-only';
import type { ReactNode } from 'react';
import { UpdateForm } from './update-form';

export const UserUpdatePasswordPage = (): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">パスワード変更</h2>
      <p className="text-muted-foreground mt-4">
        新しいパスワードを入力してください。
      </p>
      <UpdateForm className="mt-8" />
    </>
  );
};
