import { ProjectEditPage } from '#src/features/projects';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <ProjectEditPage projectId={projectId} />;
};

export default Page;
