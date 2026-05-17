import 'server-only';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUser } from '../../server';
import { ComponentForm } from './component-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const ResetPasswordConfirmPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect('/');
  }

  return (
    <div className="px-6">
      <Card className="mx-auto w-md max-w-full">
        <CardHeader>
          <CardTitle>
            <h2>パスワードのリセット</h2>
          </CardTitle>
          <CardDescription>
            確認コードと新しいパスワードを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentForm />
        </CardContent>
      </Card>
    </div>
  );
};
