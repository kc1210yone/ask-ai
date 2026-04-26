import { UpdateForm } from './update-form';
import type { ReactNode } from 'react';

interface Props {
  projectId: string;
  documentId: string;
}

export const DocumentUpdatePage = ({
  projectId,
  documentId,
}: Props): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">ドキュメント作成</h2>
      <p className="mt-4">
        ドキュメントは、AIアシスタントが参照する単体の情報です。
      </p>
      <UpdateForm
        projectId={projectId}
        documentId={documentId}
        className="mt-8"
      />
    </>
  );
};
