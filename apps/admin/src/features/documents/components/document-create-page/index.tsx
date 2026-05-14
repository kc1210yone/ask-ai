import 'server-only';
import type { ReactNode } from 'react';
import { ComponentForm } from './component-form';

interface Props {
  projectId: string;
}

export const DocumentCreatePage = ({ projectId }: Props): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">ドキュメント作成</h2>
      <p className="text-muted-foreground mt-4">
        ドキュメントは、AIアシスタントが参照する単体の情報です。
      </p>
      <ComponentForm projectId={projectId} className="mt-8" />
    </>
  );
};
