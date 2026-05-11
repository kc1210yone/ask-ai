import { type ReactNode } from 'react';
import { AssistantButton } from './assistant-button';
import { AssistantProvider } from './assistant-provider/provider';
import { Chat } from './chat';

export const Assistant = (): ReactNode => {
  return (
    <AssistantProvider>
      <AssistantButton />
      <Chat />
    </AssistantProvider>
  );
};
