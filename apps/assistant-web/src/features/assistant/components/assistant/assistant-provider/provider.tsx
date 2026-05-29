import { useState, type ReactNode } from 'react';
import { AssistantContext } from './context';

interface Props {
  projectId: string;
  children: ReactNode;
}

export const AssistantProvider = ({
  projectId,
  children,
}: Props): ReactNode => {
  const [assistantIsOpen, setAssistantIsOpen] = useState(false);

  return (
    <AssistantContext
      value={{
        projectId,
        assistantIsOpen,
        setAssistantIsOpen,
      }}
    >
      {children}
    </AssistantContext>
  );
};
