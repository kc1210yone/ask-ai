'use client';

import { signIn } from 'aws-amplify/auth';
import { useState } from 'react';
import type { LoginInput } from '#src/features/auth/lib/schemas';
import type { SignInStep } from '#src/features/auth/types';

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (data: LoginInput): Promise<SignInStep | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn({
        username: data.email,
        password: data.password,
      });
      return result.nextStep.signInStep as SignInStep;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error };
};
