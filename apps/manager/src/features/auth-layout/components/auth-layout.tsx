import { LogoutButton } from './logout-button';
import type { ReactNode } from 'react';

export const AuthLayout = ({
  children,
}: {
  children: ReactNode;
}): ReactNode => {
  return (
    <>
      <div>
        <h1>Ask AI 管理画面</h1>
        <LogoutButton />
      </div>
      <div>{children}</div>
    </>
  );
};
