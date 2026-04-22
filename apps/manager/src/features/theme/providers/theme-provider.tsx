'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props): ReactNode => {
  return <NextThemesProvider attribute="class">{children}</NextThemesProvider>;
};
