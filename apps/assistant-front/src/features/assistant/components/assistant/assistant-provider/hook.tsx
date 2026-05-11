import { useContext } from 'react';
import invariant from 'tiny-invariant';
import { AssistantContext, type ContextValue } from './context';

export const useAssistant = (): ContextValue => {
  const contextValue = useContext(AssistantContext);
  invariant(contextValue, 'AssistantContext required.');
  return contextValue;
};
