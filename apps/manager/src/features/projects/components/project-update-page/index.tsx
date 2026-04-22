import Link from 'next/link';
import { Button } from '#src/components/ui/button';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUserOrRedirect } from '#src/features/users';

interface Props {
  projectId: string;
}

export const ProjectUpdatePage = async ({ projectId }: Props) => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUserOrRedirect(authUser.userId);
  console.log(user);

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
