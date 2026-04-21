import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '../../lib/queries';
import { Button } from '#src/components/ui/button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface Props {
  projectId: string;
}

export const ProjectUpdatePage = async ({ projectId }: Props) => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  const project = await getProject(projectId, user.id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/?projectId=${projectId}`}>← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">プロジェクト編集</h2>
      </div>
    </div>
  );
};
