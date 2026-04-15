import { redirect } from 'next/navigation';
import { getAuthUser } from '#src/features/auth';

export const DashboardPage = async () => {
  const authUser = await getAuthUser().catch((error: unknown) => {
    console.error(error);
    redirect('/login');
  });

  return (
    <div>
      <pre>{JSON.stringify(authUser, null, 2)}</pre>
    </div>
  );
};
