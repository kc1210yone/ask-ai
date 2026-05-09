import { type ReactNode } from 'react';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Chat = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  if (!assistantIsOpen) {
    return null;
  }
  return (
    <ChatProvider>
      <Inner />
    </ChatProvider>
  );
};
