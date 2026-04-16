import { LogoutButton } from './logout-button';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const PrivateLayout = ({ children }: Props): ReactNode => {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="font-semibold">Ask AI 管理画面</h1>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
};
