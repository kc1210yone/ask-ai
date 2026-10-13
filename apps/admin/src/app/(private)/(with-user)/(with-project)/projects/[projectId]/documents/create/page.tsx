import 'server-only';
import type { ReactNode } from 'react';
import { DocumentCreatePage } from '#src/features/documents';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <DocumentCreatePage projectId={projectId} />;
};

export default Page;
