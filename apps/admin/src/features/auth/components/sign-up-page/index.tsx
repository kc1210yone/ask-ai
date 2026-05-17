import 'server-only';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';
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

export const SignUpPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUser();
  if (authUser) {
    redirect('/');
  }

  return (
    <div className="px-6">
      <Card className="mx-auto w-md max-w-full">
        <CardHeader>
          <CardTitle>
            <h2>アカウント作成</h2>
          </CardTitle>
          <CardDescription>
            管理画面の新規アカウントを作成します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComponentForm />
        </CardContent>
        <CardFooter>
          <p>
            すでにアカウントをお持ちの方は
            <Button variant="link" asChild className="text-card-foreground">
              <Link href="/auth/login">ログイン</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
