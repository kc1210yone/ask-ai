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

export const LoginPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect('/');
  }

  return (
    <div className="px-6">
      <Card className="mx-auto w-md max-w-full">
        <CardHeader>
          <CardTitle>
            <h2>ログイン</h2>
          </CardTitle>
          <CardDescription>
            登録済みのメールアドレスとパスワードでログインしてください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentForm />
        </CardContent>
        <CardFooter>
          <div>
            <p>
              アカウントをお持ちでない方は
              <Button variant="link" asChild className="text-card-foreground">
                <Link href="/auth/sign-up">新規登録</Link>
              </Button>
            </p>
            <p>
              パスワードを忘れた方は
              <Button variant="link" asChild className="text-card-foreground">
                <Link href="/auth/reset-password">こちら</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
