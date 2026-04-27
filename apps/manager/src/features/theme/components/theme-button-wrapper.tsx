'use client';

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { Button } from '#src/components/ui/button';
import { ButtonGroup } from '#src/components/ui/button-group';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#src/components/ui/dialog';

interface Props {
  children: ReactNode;
}

export const ThemeButtonWrapper = ({ children }: Props): ReactNode => {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>テーマ設定</DialogTitle>
          <DialogDescription>テーマを選択してください。</DialogDescription>
        </DialogHeader>
        <ButtonGroup orientation="vertical" className="w-full">
          <Button
            variant="secondary"
            onClick={() => {
              setTheme('light');
            }}
          >
            <SunIcon />
            ライト
            {theme === 'light' && <CheckIcon />}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setTheme('dark');
            }}
          >
            <MoonIcon />
            ダーク
            {theme === 'dark' && <CheckIcon />}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setTheme('system');
            }}
          >
            <MonitorIcon />
            システム
            {theme === 'system' && <CheckIcon />}
          </Button>
        </ButtonGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">OK</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
