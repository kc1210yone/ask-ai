'use client';

import { Amplify } from 'aws-amplify';
import { amplifyConfig } from '../lib/amplify';
import type { ReactNode } from 'react';

Amplify.configure(amplifyConfig, { ssr: true });

export const ConfigureAmplifyClientSide = (): ReactNode => {
  return null;
};
