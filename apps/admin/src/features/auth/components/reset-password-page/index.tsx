import 'server-only';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAuthUser } from '../../server';
import { ComponentForm } from './component-form';
import { Button } from '#src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const ResetPasswordPage = async (): Promise<ReactNode> => {
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
            パスワードをリセットするアカウントのユーザー名（メールアドレス）を入力してください。確認コードをお送りします。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentForm />
        </CardContent>
        <CardFooter>
          <p>
            パスワードがわかる方は
            <Button variant="link" asChild className="text-card-foreground">
              <Link href="/auth/login">ログイン</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
