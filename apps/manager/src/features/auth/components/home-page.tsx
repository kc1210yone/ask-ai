import { redirect } from 'next/navigation';
import { getUser } from '#src/features/auth/server';
import { LogoutButton } from './logout-button';

export const HomePage = async () => {
  const user = await getUser().catch((error: unknown) => {
    console.error(error);
    redirect('/login');
  });

  return (
    <div>
      <LogoutButton />
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
