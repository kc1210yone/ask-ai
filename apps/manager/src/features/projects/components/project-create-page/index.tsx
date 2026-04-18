import Link from 'next/link';
import { createProject } from '../../actions';
import { ProjectForm } from '../project-form';
import { Button } from '#src/components/ui/button';

export const ProjectCreatePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← 戻る</Link>
        </Button>
        <h2 className="text-xl font-semibold">プロジェクト作成</h2>
      </div>
      <ProjectForm action={createProject} cancelHref="/" />
    </div>
  );
};
