import { LogoutButton } from './logout-button';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const PrivateLayout = ({ children }: Props): ReactNode => {
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
