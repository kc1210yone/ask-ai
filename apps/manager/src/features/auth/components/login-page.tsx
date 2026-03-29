import { Card } from '#src/components/ui/card';
import { LoginForm } from './login-form';

export const LoginPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            ログイン
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            管理画面にログインしてください
          </p>
        </div>
        <Card>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
};
