import 'server-only';
import type { ReactNode } from 'react';
import { ComponentForm } from './component-form';

export const UserUpdatePasswordPage = (): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">パスワード変更</h2>
      <p className="text-muted-foreground mt-4">
        新しいパスワードを入力してください。変更後は、次回のログインから新しいパスワードが必要になります。
      </p>
      <ComponentForm className="mt-8" />
    </>
  );
};
