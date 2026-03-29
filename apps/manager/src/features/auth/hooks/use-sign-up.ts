'use client';

import { confirmSignUp, signUp } from 'aws-amplify/auth';
import { useState } from 'react';
import type { SignUpInput } from '#src/features/auth/lib/schemas';
import type { SignUpStep } from '#src/features/auth/types';

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (data: SignUpInput): Promise<SignUpStep | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signUp({
        username: data.email,
        password: data.password,
      });
      return result.nextStep.signUpStep as SignUpStep;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'アカウント作成に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const confirm = async (
    email: string,
    code: string,
  ): Promise<SignUpStep | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      return result.nextStep.signUpStep as SignUpStep;
    } catch (e) {
      setError(e instanceof Error ? e.message : '確認コードが正しくありません');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, confirm, isLoading, error };
};
