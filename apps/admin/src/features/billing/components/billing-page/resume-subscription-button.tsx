'use client';

import 'client-only';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { resumeSubscriptionAction } from './actions';
import { Button } from '#src/components/ui/button';

export const ResumeSubscriptionButton = (): ReactNode => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await resumeSubscriptionAction();
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('サブスクリプションの解約予約の取り消しに失敗しました。');
      setIsLoading(false);
      return;
    }
    toast.success('サブスクリプションの解約予約を取り消しました。');
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={onClick}
    >
      解約を取り消す
    </Button>
  );
};
