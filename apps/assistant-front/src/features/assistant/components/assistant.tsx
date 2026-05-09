import { useState, type ReactNode } from 'react';
import { AssistantButton } from './assistant-button';
import { Chat } from './chat';

export const Assistant = (): ReactNode => {
  const [assistantIsOpen, setAssistantIsOpen] = useState(false);

  return (
    <>
      <AssistantButton
        assistantIsOpen={assistantIsOpen}
        setAssistantIsOpen={setAssistantIsOpen}
      />
      <Chat
        assistantIsOpen={assistantIsOpen}
        setAssistantIsOpen={setAssistantIsOpen}
      />
    </>
  );
};
