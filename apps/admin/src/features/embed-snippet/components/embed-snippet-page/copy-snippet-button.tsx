'use client';

import 'client-only';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '#src/components/ui/button';

interface Props {
  snippet: string;
  className?: string | undefined;
}

export const CopySnippetButton = ({ snippet, className }: Props): ReactNode => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch (error) {
      console.warn(error);
      toast.error('コピーに失敗しました。');
      return;
    }
    setIsCopied(true);
    toast.success('コピーしました。');
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button
      type="button"
      variant="secondary"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={onClick}
      className={className}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
      {isCopied ? 'コピーしました' : 'コピー'}
    </Button>
  );
};
