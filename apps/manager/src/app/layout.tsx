import '#src/app/globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Next.js Example',
};

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
};

export default Layout;
