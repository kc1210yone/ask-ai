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

  const assistantTag = `<ask-ai-assistant
  project-id="${project.id}"
></ask-ai-assistant>`;

  const scriptTag = `<script
  type="module"
  src="${ASSISTANT_WEB_SCRIPT_URL}"
></script>`;

  return (
    <>
      <h2 className="text-xl font-semibold">設置方法</h2>
      <p className="text-muted-foreground mt-4">
        以下の2つのタグを、それぞれ指定の場所にあわせてWebサイトのHTMLに貼り付けてください。
      </p>
      <div className="mt-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">① AIアシスタントのボタン</p>
            <p className="text-muted-foreground text-sm">
              ボタンを表示したい箇所に埋め込んでください。
            </p>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
            <code>{assistantTag}</code>
          </pre>
          <CopySnippetButton snippet={assistantTag} className="self-start" />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">② 読み込み用スクリプト</p>
            <p className="text-muted-foreground text-sm">
              ページ下部（{'</body>'}
              の直前など）に埋め込んでください。
            </p>
          </div>
          <pre className="bg-muted overflow-x-auto rounded-md p-4 text-sm">
            <code>{scriptTag}</code>
          </pre>
          <CopySnippetButton snippet={scriptTag} className="self-start" />
        </div>
      </div>
    </>
  );
};
