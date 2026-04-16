import Link from 'next/link';
import { DeleteProjectButton } from './delete-project-button';
import type { ProjectWithCounts } from '../lib/queries';
import { Button } from '#src/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '#src/components/ui/card';

interface Props {
  project: ProjectWithCounts;
}

export const ProjectCard = ({ project }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/projects/${project.id}`} className="hover:underline">
            {project.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Document: {project._count.documents}件 / FAQ: {project._count.faqs}件
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}`}>詳細</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/projects/${project.id}/edit`}>編集</Link>
        </Button>
        <DeleteProjectButton projectId={project.id} />
      </CardFooter>
    </Card>
  );
};
