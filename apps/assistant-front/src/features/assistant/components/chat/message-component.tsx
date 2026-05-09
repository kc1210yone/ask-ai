import type { ReactNode } from 'react';
import type { Message } from './types.ts';

interface Props {
  message: Message;
}

export const MessageComponent = ({ message }: Props): ReactNode => {
  return <div>{message.content}</div>;
};
