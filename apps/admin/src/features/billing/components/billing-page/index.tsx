import 'server-only';
import { CheckCircle2Icon, TriangleAlertIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { findSubscription } from '../../server';
import { createCheckoutSessionAction } from './actions';
import { CancelSubscriptionButton } from './cancel-subscription-button';
import { ResumeSubscriptionButton } from './resume-subscription-button';
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
import { formatWithTimeZone } from '#src/lib/date-time-utils';

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
        現在のサブスクリプションの状態を確認できます。未登録の場合は、下記から新規にお申し込みいただけます。
      </p>

      {/* 決済完了・キャンセル時のフィードバックメッセージ */}
      {success && (
        <Alert className="mt-4">
          <CheckCircle2Icon />
          <AlertDescription>
            サブスクリプションへのご登録が完了しました。ご利用ありがとうございます。
          </AlertDescription>
        </Alert>
      )}
      {canceled && (
        <Alert variant="destructive" className="mt-4">
          <TriangleAlertIcon />
          <AlertDescription>
            決済手続きがキャンセルされました。よろしければ、あらためてお手続きください。
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
            <div className="space-y-4">
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
                    {formatWithTimeZone(
                      subscription.currentPeriodStart,
                      'yyyy年M月d日',
                    )}{' '}
                    〜{' '}
                    {formatWithTimeZone(
                      subscription.currentPeriodEnd,
                      'yyyy年M月d日',
                    )}
                  </p>
                </div>
              </div>

              {subscription.status === 'active' &&
                (subscription.cancelAtPeriodEnd ? (
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-sm">
                      {formatWithTimeZone(
                        subscription.currentPeriodEnd,
                        'yyyy年M月d日',
                      )}
                      の契約期間終了をもって解約される予定です。
                    </p>
                    <ResumeSubscriptionButton />
                  </div>
                ) : (
                  <CancelSubscriptionButton
                    currentPeriodEndLabel={formatWithTimeZone(
                      subscription.currentPeriodEnd,
                      'yyyy年M月d日',
                    )}
                  />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                現在、サブスクリプションにご登録いただいていません。下のボタンからお申し込みいただけます。
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
