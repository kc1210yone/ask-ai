'use client';

import 'client-only';
import type { Project } from '@internal/rdb/generated/prisma/client.js';
import { useState, type ReactNode } from 'react';
import { upload } from './actions';
import { Button } from '#src/components/ui/button';

interface Props {
  project: Pick<Project, 'id' | 'knowledgeBaseIsUploading'>;
  className?: string | undefined;
}

export const UploadButton = ({ project, className }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (): Promise<void> => {
    setIsLoading(true);
    const response = await upload(project.id);
    console.log(response.status);
  };

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={onClick}
      disabled={project.knowledgeBaseIsUploading || isLoading}
      className={className}
    >
      {project.knowledgeBaseIsUploading
        ? 'ナレッジベースを反映中'
        : 'ナレッジベースを反映'}
    </Button>
  );
};
