import Link from 'next/link';
import { LoginForm } from './login-form';
import type { ReactNode } from 'react';
import { Button } from '#src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#src/components/ui/card';

export const LoginPage = (): ReactNode => {
  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>
          <h2>ログイン</h2>
        </CardTitle>
        <CardDescription>管理画面にログインしてください。</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <p>
          アカウントをお持ちでない方は
          <Button variant="link" asChild className="text-card-foreground">
            <Link href="/auth/sign-up">新規登録</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};
