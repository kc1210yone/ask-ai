import { type ReactNode } from 'react';
import { AssistantButton } from './assistant-button';
import { AssistantProvider } from './assistant-provider/provider';
import { Chat } from './chat';

interface Props {
  projectId: string;
  zIndex?: number | undefined;
}

export const Assistant = ({ projectId, zIndex }: Props): ReactNode => {
  return (
    <AssistantProvider projectId={projectId} zIndex={zIndex}>
      <AssistantButton />
      <Chat />
    </AssistantProvider>
  );
};
