import type { ReactNode } from 'react';
import { CreateForm } from './create-form';

interface Props {
  projectId: string;
}

export const FaqCreatePage = ({ projectId }: Props): ReactNode => {
  return (
    <>
      <h2 className="text-xl font-semibold">FAQ作成</h2>
      <p className="mt-4">
        FAQは、AIアシスタントが参照する質問と回答のペアです。
      </p>
      <CreateForm projectId={projectId} className="mt-8" />
    </>
  );
};
