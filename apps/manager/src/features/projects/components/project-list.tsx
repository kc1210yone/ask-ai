import Link from 'next/link';
import { getUserProjects } from '../lib/queries';
import { ProjectCard } from './project-card';
import { Button } from '#src/components/ui/button';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const ProjectList = async () => {
  const user = await findOrCreateCurrentUser();
  const projects = await getUserProjects(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">プロジェクト一覧</h2>
        <Button asChild>
          <Link href="/projects/create">+ 新規作成</Link>
        </Button>
      </div>
      {projects.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          プロジェクトがありません。新規作成してください。
        </p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
