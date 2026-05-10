import { type ComponentProps, type ReactNode } from 'react';
import { ChatProvider } from './chat-provider/provider';
import { Inner } from './inner';

type Props = ComponentProps<typeof Inner>;

export const Chat = (props: Props): ReactNode => {
  return (
    <ChatProvider>
      <Inner {...props} />
    </ChatProvider>
  );
};
