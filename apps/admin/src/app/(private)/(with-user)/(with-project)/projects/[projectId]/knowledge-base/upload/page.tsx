import 'server-only';
import type { ReactNode } from 'react';
import { KnowledgeBaseUploadPage } from '#src/features/knowledge-base';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <KnowledgeBaseUploadPage projectId={projectId} />;
};

export default Page;
