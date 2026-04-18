import Link from 'next/link';
import { redirect } from 'next/navigation';
import invariant from 'tiny-invariant';
import { getUserProjects } from '../../lib/queries';
import type { ReactNode } from 'react';
import { findOrCreateCurrentUser } from '#src/lib/user';

export const RootPage = async (): Promise<ReactNode> => {
  const user = await findOrCreateCurrentUser();
  const projects = await getUserProjects(user.id);

  if (projects.length === 0) {
    redirect('/projects/create');
  }

  if (projects.length === 1) {
    const project = projects[0];
    invariant(project);
    redirect(`/projects/${project.id}/dashboard`);
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold">プロジェクトを選択</h2>
      <div className="grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}/dashboard`}
            className="hover:bg-accent rounded-lg border p-4 transition-colors"
          >
            {project.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
