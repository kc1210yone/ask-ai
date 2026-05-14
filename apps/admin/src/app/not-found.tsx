import 'server-only';
import { CircleXIcon } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

const NotFound = (): ReactNode => {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex">
        <CircleXIcon className="size-20" />
        <div className="ml-8 flex flex-col">
          <h1 className="text-3xl font-semibold">Ask AI 管理画面</h1>
          <p className="mt-4 text-xl">ページが見つかりませんでした。</p>
          <Link href="/" className="mt-8 w-fit hover:underline">
            管理画面トップ
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
