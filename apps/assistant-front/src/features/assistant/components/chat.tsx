import { useState, type ReactNode } from 'react';

interface Props {
  assistantIsOpen: boolean;
  setAssistantIsOpen: (value: boolean) => void;
}

export const Chat = ({
  assistantIsOpen,
  setAssistantIsOpen,
}: Props): ReactNode => {
  const [n, setN] = useState(0);
  if (!assistantIsOpen) {
    return null;
  }
  return (
    <div>
      <button
        onClick={() => {
          setAssistantIsOpen(false);
        }}
      >
        x
      </button>
      <p>Chat</p>
      <button
        onClick={() => {
          setN((prev) => prev + 1);
        }}
      >
        Inc {n}
      </button>
    </div>
  );
};
