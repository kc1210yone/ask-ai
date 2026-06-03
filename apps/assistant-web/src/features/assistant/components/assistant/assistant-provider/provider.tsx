import { useState, type ReactNode } from 'react';
import { AssistantContext } from './context';

interface Props {
  projectId: string;
  zIndex?: number | undefined;
  children: ReactNode;
}

export const AssistantProvider = ({
  projectId,
  zIndex,
  children,
}: Props): ReactNode => {
  const [assistantIsOpen, setAssistantIsOpen] = useState(false);

  return (
    <AssistantContext
      value={{
        projectId,
        zIndex,
        assistantIsOpen,
        setAssistantIsOpen,
      }}
    >
      {children}
    </AssistantContext>
  );
};
