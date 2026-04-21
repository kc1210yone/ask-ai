import type { ReactNode } from 'react';

interface Props {
  projectId: string;
}

export const FaqsPage = ({ projectId }: Props): ReactNode => {
  return <div>FAQs Page {projectId}</div>;
};
