import { DashboardPage } from '#src/features/dashboard';

interface Props {
  searchParams: Promise<{ projectId?: string }>;
}

const Page = async ({ searchParams }: Props) => {
  const { projectId } = await searchParams;
  return <DashboardPage {...(projectId !== undefined ? { projectId } : {})} />;
};

export default Page;
