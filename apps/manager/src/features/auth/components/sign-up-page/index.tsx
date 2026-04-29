import 'server-only';
import Link from 'next/link';
import { type ReactNode } from 'react';
import { SignUpForm } from './sign-up-form';
import { Button } from '#src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const SignUpPage = (): ReactNode => {
  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>
          <h2>アカウント作成</h2>
        </CardTitle>
        <CardDescription>
          管理画面の新規アカウントを作成します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
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
  );
};
