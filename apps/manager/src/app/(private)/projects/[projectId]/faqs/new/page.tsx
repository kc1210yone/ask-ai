import type { ReactNode } from 'react';
import { FaqNewPage } from '#src/features/faqs';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <FaqNewPage projectId={projectId} />;
};

export default Page;
