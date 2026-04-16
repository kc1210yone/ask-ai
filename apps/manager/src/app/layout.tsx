import '#src/app/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Toaster } from '#src/components/ui/sonner';
import { AmplifyProvider } from '#src/features/auth';
import { cn } from '#src/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Ask AI 管理画面',
};

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props): ReactNode => {
  return (
    <html lang="ja" className={cn('font-sans', inter.variable)}>
      <AmplifyProvider>
        <body>
          {children}
          <Toaster />
        </body>
      </AmplifyProvider>
    </html>
  );
};

export default Layout;
