'use client';

import 'client-only';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { cancelSubscriptionAction } from './actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '#src/components/ui/alert-dialog';
import { Button } from '#src/components/ui/button';

interface Props {
  currentPeriodEndLabel: string;
}

export const CancelSubscriptionButton = ({
  currentPeriodEndLabel,
}: Props): ReactNode => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onAction = async (): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await cancelSubscriptionAction();
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('サブスクリプションの解約に失敗しました。');
      setIsLoading(false);
      return;
    }
    toast.success('サブスクリプションの解約を予約しました。');
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" disabled={isLoading}>
          解約する
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            サブスクリプションを解約しますか？
          </AlertDialogTitle>
          <AlertDialogDescription>
            解約すると、現在の契約期間の終了日（{currentPeriodEndLabel}
            ）以降は無料プランとなり、ドキュメント・FAQの登録数やチャット回数に上限が適用されます。それまでの間は、引き続き現在のプランでご利用いただけます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => void onAction()}
          >
            解約する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
