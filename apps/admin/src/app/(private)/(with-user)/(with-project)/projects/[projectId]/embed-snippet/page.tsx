import 'server-only';
import type { ReactNode } from 'react';
import { EmbedSnippetPage } from '#src/features/embed-snippet';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props): Promise<ReactNode> => {
  const { projectId } = await params;
  return <EmbedSnippetPage projectId={projectId} />;
};

export default Page;
