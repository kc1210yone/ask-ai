import { Card } from '#src/components/ui/card';
import { SignUpForm } from './signup-form';

export const SignUpPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            アカウントを作成
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            管理画面の新規アカウントを作成します
          </p>
        </div>
        <Card>
          <SignUpForm />
        </Card>
      </div>
    </main>
  );
};
