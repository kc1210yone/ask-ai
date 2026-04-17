import type { ReactNode } from 'react';
import { DocumentUpdatePage } from '#src/features/documents';

interface Props {
  params: Promise<{ projectId: string; documentId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId, documentId } = await params;
  return <DocumentUpdatePage projectId={projectId} documentId={documentId} />;
};

export default Page;
