import { FaqEditPage } from '#src/features/faqs';

interface Props {
  params: Promise<{ projectId: string; faqId: string }>;
}

const Page = async ({ params }: Props) => {
  const { projectId, faqId } = await params;
  return <FaqEditPage projectId={projectId} faqId={faqId} />;
};

export default Page;
