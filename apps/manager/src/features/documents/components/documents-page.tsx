import type { ReactNode } from 'react';

interface Props {
  projectId: string;
}

export const DocumentsPage = ({ projectId }: Props): ReactNode => {
  return <div>Documents Page {projectId}</div>;
};
