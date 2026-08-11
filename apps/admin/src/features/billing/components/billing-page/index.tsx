import 'server-only';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CheckCircle2Icon, TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { findSubscription } from '../../server';
import { createCheckoutSessionAction } from './actions';
import { Alert, AlertDescription } from '#src/components/ui/alert';
import { Badge } from '#src/components/ui/badge';
import { Button } from '#src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface Props {
  success?: boolean;
  canceled?: boolean;
}

// サブスクリプションのstatusを日本語ラベルに変換する
const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: '有効',
    canceled: 'キャンセル済み',
    past_due: '支払い期限超過',
    unpaid: '未払い',
    trialing: 'トライアル中',
    incomplete: '未完了',
    incomplete_expired: '期限切れ',
    paused: '一時停止中',
  };
  return labels[status] ?? status;
};

export const BillingPage = async ({
  success,
  canceled,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const subscription = await findSubscription(user.id);

  return (
    <>
      <h2 className="text-xl font-semibold">プラン・請求</h2>
      <p className="text-muted-foreground mt-4">
        サブスクリプションの状態を確認・管理できます。
      </p>

      {/* 決済完了・キャンセル時のフィードバックメッセージ */}
      {success && (
        <Alert className="mt-4">
          <CheckCircle2Icon />
          <AlertDescription>
            サブスクリプションへの登録が完了しました。ご利用ありがとうございます。
          </AlertDescription>
        </Alert>
      )}
      {canceled && (
        <Alert variant="destructive" className="mt-4">
          <TriangleAlertIcon />
          <AlertDescription>
            決済がキャンセルされました。引き続きご検討ください。
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>スタンダードプラン</CardTitle>
          <CardDescription>月額 ¥980（税込）</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm">状態</span>
                <Badge
                  variant={
                    subscription.status === 'active' ? 'default' : 'secondary'
                  }
                >
                  {getStatusLabel(subscription.status)}
                </Badge>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">現在の契約期間</span>
                <p className="mt-1">
                  {format(subscription.currentPeriodStart, 'yyyy年M月d日', {
                    locale: ja,
                  })}{' '}
                  〜{' '}
                  {format(subscription.currentPeriodEnd, 'yyyy年M月d日', {
                    locale: ja,
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                現在サブスクリプションに登録されていません。
              </p>
              <form action={createCheckoutSessionAction}>
                <Button type="submit">サブスクリプションを開始する</Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
