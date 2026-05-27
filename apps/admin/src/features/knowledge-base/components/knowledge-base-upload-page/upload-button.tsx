'use client';

import 'client-only';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { upload } from './actions';
import { Button } from '#src/components/ui/button';

interface Props {
  projectId: string;
  className?: string | undefined;
}

export const UploadButton = ({ projectId, className }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const onClick = async (): Promise<void> => {
    setIsLoading(true);
    let response;
    try {
      response = await upload(projectId);
    } catch (error) {
      console.warn(error);
      response = null;
    }
    if (!response || response.status === 'error') {
      toast.error('ナレッジベースの反映に失敗しました。');
      setIsLoading(false);
      return;
    }
    toast.success('ナレッジベースの反映を開始しました。');
    setIsUploading(true);
  };

  return (
    <>
      <Button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={onClick}
        disabled={isLoading || isUploading}
        className={className}
      >
        {isUploading ? 'ナレッジベースを反映中' : 'ナレッジベースを反映'}
      </Button>
      {isUploading && (
        <p className="text-muted-foreground mt-4 text-sm">
          ナレッジベースの反映を行ってから実際にAIアシスタントの回答にデータが反映されるまで、最大1時間程度かかります。ページを離れてお待ちください。
        </p>
      )}
    </>
  );
};
