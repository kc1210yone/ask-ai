'use client';

import 'client-only';
import { Amplify } from 'aws-amplify';
import type { ReactNode } from 'react';
import { amplifyConfig } from '../lib/amplify';

Amplify.configure(amplifyConfig, { ssr: true });

export const ConfigureAmplifyClientSide = (): ReactNode => {
  return null;
};
