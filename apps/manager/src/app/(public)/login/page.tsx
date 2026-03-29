'use client';

import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { type SyntheticEvent, useState } from 'react';
import { z } from 'zod';
import { Login } from '#src/features/auth/login';

const LoginSchema = z.object({
  username: z.email(),
  password: z.string(),
});

export default function LoginPage() {
  const [step, setStep] = useState('');
  const router = useRouter();

  const handleLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = LoginSchema.safeParse({
      username: (() => {
        const v = data.get('username');
        return typeof v === 'string' ? v : undefined;
      })(),
      password: (() => {
        const v = data.get('password');
        return typeof v === 'string' ? v : undefined;
      })(),
    });
    if (!parsed.success) {
      // error handling
      console.error(parsed.error);
      return;
    }
    const signInStep = await signIn(parsed.data)
      .catch((error: unknown) => {
        // error handling
        console.log(error);
        return null;
      })
      .then((result) => result?.nextStep.signInStep);

    if (signInStep === 'DONE') {
      router.push('/');
      return;
    }

    if (signInStep) {
      setStep(signInStep);
    }
  };

  if (step === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
    // step に応じた処理
  }
  return <Login handleSubmit={void handleLogin} />;
}
