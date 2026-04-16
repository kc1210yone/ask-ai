import { ProjectDetailPage } from '#src/features/projects';

interface Props {
  params: Promise<{ projectId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId } = await params;
  return <ProjectDetailPage projectId={projectId} />;
};

export default Page;
