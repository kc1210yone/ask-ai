import { redirect } from 'next/navigation';
import { Separator } from '#src/components/ui/separator';
import { getAuthUser } from '#src/features/auth';
import { DocumentList } from '#src/features/documents';
import { FaqList } from '#src/features/faqs';
import { ProjectSwitcher } from '#src/features/projects/components/project-switcher';
import { getUserProjects } from '#src/features/projects/lib/queries';
import { prisma } from '#src/lib/prisma';
import { findOrCreateCurrentUser } from '#src/lib/user';

interface Props {
  projectId?: string;
}

export const ProjectPage = async ({ projectId }: Props) => {
  await getAuthUser().catch((error: unknown) => {
    console.error(error);
    redirect('/login');
  });

  const user = await findOrCreateCurrentUser();
  const projects = await getUserProjects(user.id);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">プロジェクト</h2>
          <ProjectSwitcher projects={[]} />
        </div>
        <p className="text-muted-foreground text-sm">
          プロジェクトを作成してDocumentやFAQを管理しましょう。
        </p>
      </div>
    );
  }

  const selectedProjectId = projectId ?? projects[0]?.id;
  if (!selectedProjectId) redirect('/');

  if (!projectId) {
    redirect(`/projects/${selectedProjectId}`);
  }

  const project = await prisma.project.findFirst({
    where: { id: selectedProjectId, userId: user.id },
    include: {
      documents: { orderBy: { createdAt: 'desc' } },
      faqs: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!project) redirect('/');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          プロジェクト:
        </span>
        <ProjectSwitcher projects={projects} />
      </div>
      <Separator />
      <DocumentList
        projectId={selectedProjectId}
        documents={project.documents}
      />
      <Separator />
      <FaqList projectId={selectedProjectId} faqs={project.faqs} />
    </div>
  );
};
