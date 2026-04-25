import type { ReactNode } from 'react';
import { FaqsPage } from '#src/features/faqs';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <FaqsPage projectId={projectId} />;
};

export default Page;
