import { useContext } from 'react';
import invariant from 'tiny-invariant';
import { ChatContext, type ContextValue } from './context';

export const useChat = (): ContextValue => {
  const contextValue = useContext(ChatContext);
  invariant(contextValue, 'ChatContext required.');
  return contextValue;
};
