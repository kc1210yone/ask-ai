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
    <Card className="w-md">
      <CardHeader>
        <CardTitle>
          <h2>パスワードのリセット</h2>
        </CardTitle>
        <CardDescription>
          パスワードをリセットしたいアカウント情報を入力してください。
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
  );
};
