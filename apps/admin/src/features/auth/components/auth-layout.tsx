import 'server-only';
import Link from 'next/link';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const AuthLayout = ({ children }: Props): ReactNode => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <header>
        <Link href={'/'}>
          <h1 className="text-2xl font-semibold">Ask AI 管理画面</h1>
        </Link>
      </header>
      <main>{children}</main>
    </div>
  );
};
