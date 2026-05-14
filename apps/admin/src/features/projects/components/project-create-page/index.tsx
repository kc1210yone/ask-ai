import 'server-only';
import type { ReactNode } from 'react';
import { ComponentForm } from './component-form';

export const ProjectCreatePage = (): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">プロジェクト作成</h2>
      <p className="text-muted-foreground mt-4">
        新規作成するプロジェクトの情報を入力してください。
      </p>
      <ComponentForm className="mt-8" />
    </>
  );
};
