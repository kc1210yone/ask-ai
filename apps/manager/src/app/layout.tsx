import 'server-only';
import '#src/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Toaster } from '#src/components/ui/sonner';
import { TooltipProvider } from '#src/components/ui/tooltip';
import { ConfigureAmplifyClientSide } from '#src/features/auth';
import { ThemeProvider } from '#src/features/theme';
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
    <html
      lang="ja"
      className={cn('font-sans', inter.variable)}
      suppressHydrationWarning
    >
      <body>
        <ConfigureAmplifyClientSide />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default Layout;
