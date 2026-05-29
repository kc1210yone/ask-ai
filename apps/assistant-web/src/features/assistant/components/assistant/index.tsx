import { type ReactNode } from 'react';
import { AssistantButton } from './assistant-button';
import { AssistantProvider } from './assistant-provider/provider';
import { Chat } from './chat';

interface Props {
  projectId: string;
}

export const Assistant = ({ projectId }: Props): ReactNode => {
  return (
    <AssistantProvider projectId={projectId}>
      <AssistantButton />
      <Chat />
    </AssistantProvider>
  );
};
