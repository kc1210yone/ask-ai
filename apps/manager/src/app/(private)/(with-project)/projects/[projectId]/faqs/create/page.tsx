import type { ReactNode } from 'react';
import { FaqCreatePage } from '#src/features/faqs';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <FaqCreatePage projectId={projectId} />;
};

export default Page;
