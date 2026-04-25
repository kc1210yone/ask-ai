import { type ReactNode } from 'react';
import { ConfirmForm } from './confirm-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const SignUpConfirmPage = (): ReactNode => {
  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>
          <h2>アカウント認証</h2>
        </CardTitle>
        <CardDescription>
          メールに送信された確認コードを入力してください。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ConfirmForm />
      </CardContent>
    </Card>
  );
};
