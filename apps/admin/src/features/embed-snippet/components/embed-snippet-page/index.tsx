import 'server-only';
import { prisma } from '@internal/rdb/index.js';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { CopySnippetButton } from './copy-snippet-button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';
import { serverLogger } from '#src/lib/logger';

interface Props {
  projectId: string;
}

const ASSISTANT_WEB_SCRIPT_URL =
  'https://assistant-web.ask-ai.cognova-ai.com/ask-ai-assistant.js';

export const EmbedSnippetPage = async ({
  projectId,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);

  const project = await prisma.project.findUnique({
    where: { id: projectId, deletedAt: null },
  });
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (!project || project.userId !== user.id) {
    serverLogger.warn('Invalid project.');
    notFound();
  }

  const snippet = `<ask-ai-assistant
  project-id="${project.id}"
></ask-ai-assistant>
<script
  type="module"
  src="${ASSISTANT_WEB_SCRIPT_URL}"
></script>`;

  return (
    <>
      <h2 className="text-xl font-semibold">設置方法</h2>
      <p className="text-muted-foreground mt-4">
        以下のスニペットを、AIアシスタントを表示したいWebサイトのHTMLに貼り付けてください。貼り付けるだけで、チャットウィジェットが自動的に表示されます。
      </p>
      <div className="mt-4 flex flex-col gap-4">
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
          <code>{snippet}</code>
        </pre>
        <CopySnippetButton snippet={snippet} className="self-start" />
      </div>
    </>
  );
};
