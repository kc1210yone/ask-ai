import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject } from '../lib/queries';
import { DeleteProjectButton } from './delete-project-button';
import { Button } from '#src/components/ui/button';
import { Separator } from '#src/components/ui/separator';
import { DocumentList } from '#src/features/documents';
import { FaqList } from '#src/features/faqs';
import { findOrCreateCurrentUser } from '#src/lib/user';

interface Props {
  projectId: string;
}

export const ProjectDetailPage = async ({ projectId }: Props) => {
  const user = await findOrCreateCurrentUser();
  const project = await getProject(projectId, user.id);
  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← 戻る</Link>
          </Button>
          <h2 className="text-xl font-semibold">{project.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/projects/${projectId}/edit`}>編集</Link>
          </Button>
          <DeleteProjectButton projectId={projectId} />
        </div>
      </div>
      <Separator />
      <DocumentList projectId={projectId} documents={project.documents} />
      <Separator />
      <FaqList projectId={projectId} faqs={project.faqs} />
    </div>
  );
};
