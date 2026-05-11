import { useState, type ReactNode } from 'react';
import { AssistantContext } from './context';

interface Props {
  children: ReactNode;
}

export const AssistantProvider = ({ children }: Props): ReactNode => {
  const [assistantIsOpen, setAssistantIsOpen] = useState(false);

  return (
    <AssistantContext
      value={{
        assistantIsOpen,
        setAssistantIsOpen,
      }}
    >
      {children}
    </AssistantContext>
  );
};
