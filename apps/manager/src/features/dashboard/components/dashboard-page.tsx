import { redirect } from 'next/navigation';
import { getUser } from '#src/features/auth/server';

export const DashboardPage = async () => {
  const user = await getUser().catch((error: unknown) => {
    console.error(error);
    redirect('/login');
  });

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
