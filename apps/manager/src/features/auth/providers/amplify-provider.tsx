'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import type { ReactNode } from 'react';
import { amplifyConfig } from '#src/features/auth/lib/amplify-config';

Amplify.configure(amplifyConfig, { ssr: true });

interface Props {
  children: ReactNode;
}

export const AmplifyProvider = ({ children }: Props): ReactNode => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};
