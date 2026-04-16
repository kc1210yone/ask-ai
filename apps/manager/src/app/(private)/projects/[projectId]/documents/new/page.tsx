import type { ReactNode } from 'react';
import { DocumentNewPage } from '#src/features/documents';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <DocumentNewPage projectId={projectId} />;
};

export default Page;
