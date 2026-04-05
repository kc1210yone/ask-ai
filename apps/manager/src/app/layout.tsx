import '#src/app/globals.css';
import { AmplifyProvider } from '#src/features/auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Ask AI 管理画面',
};

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="ja">
      <AmplifyProvider>
        <body className="antialiased">{children}</body>
      </AmplifyProvider>
    </html>
  );
};

export default RootLayout;
