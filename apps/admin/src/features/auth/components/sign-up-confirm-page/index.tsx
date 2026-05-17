import 'server-only';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
import { getAuthUser } from '../../server';
import { ComponentForm } from './component-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const SignUpConfirmPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect('/');
  }

  return (
    <div className="px-6">
      <Card className="mx-auto w-md max-w-full">
        <CardHeader>
          <CardTitle>
            <h2>アカウント認証</h2>
          </CardTitle>
          <CardDescription>
            メールに送信された確認コードを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentForm />
        </CardContent>
      </Card>
    </div>
  );
};
