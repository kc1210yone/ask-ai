import 'server-only';
import type { ReactNode } from 'react';
import { CreateForm } from './create-form';

interface Props {
  projectId: string;
}

export const DocumentCreatePage = ({ projectId }: Props): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">ドキュメント作成</h2>
      <p className="mt-4">
        ドキュメントは、AIアシスタントが参照する単体の情報です。
      </p>
      <CreateForm projectId={projectId} className="mt-8" />
    </>
  );
};
