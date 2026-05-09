import { BotMessageSquareIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const AssistantButton = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  if (assistantIsOpen) {
    return null;
  }
  return (
    <button
      className="fixed right-8 bottom-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600"
      onClick={() => {
        setAssistantIsOpen(true);
      }}
    >
      <BotMessageSquareIcon />
    </button>
  );
};
