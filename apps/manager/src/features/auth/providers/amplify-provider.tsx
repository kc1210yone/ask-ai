'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '#src/features/auth/lib/config';
import type { ReactNode } from 'react';

Amplify.configure(amplifyConfig, { ssr: true });

export const AmplifyProvider = ({ children }: { children: ReactNode }) => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};
