'use client';

import 'client-only';
import type { Document } from '@internal/db/generated/prisma/client.js';
import { PencilIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { DeleteButtonWrapper } from '../delete-button-wrapper';
import { Button } from '#src/components/ui/button';
import { ButtonGroup } from '#src/components/ui/button-group';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '#src/components/ui/item';
import { cn } from '#src/lib/utils';

interface Props {
  projectId: string;
  document: Document;
}

export const DocumentItem = ({ projectId, document }: Props): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const preDelete = (): void => {
    setIsLoading(true);
  };

  const postDelete = (status: 'ok' | 'error'): void => {
    if (status === 'error') {
      toast.error('ドキュメントの削除に失敗しました。');
      setIsLoading(false);
      return;
    }
    setIsDeleted(true);
    toast.success('ドキュメントを削除しました。');
  };

  return (
    <Item variant="outline" className={cn(isDeleted && 'hidden')}>
      <ItemContent className="min-w-0">
        <ItemTitle className="max-w-full">
          <p className="truncate">{document.title}</p>
        </ItemTitle>
        <ItemDescription className="truncate">
          {document.content}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ButtonGroup>
          <DeleteButtonWrapper
            projectId={projectId}
            documentId={document.id}
            preDelete={preDelete}
            postDelete={postDelete}
          >
            <Button variant="destructive" disabled={isLoading}>
              <TrashIcon />
            </Button>
          </DeleteButtonWrapper>
          <Button asChild>
            <Link
              href={`/projects/${projectId}/documents/${document.id}/update`}
            >
              <PencilIcon />
            </Link>
          </Button>
        </ButtonGroup>
      </ItemActions>
    </Item>
  );
};
