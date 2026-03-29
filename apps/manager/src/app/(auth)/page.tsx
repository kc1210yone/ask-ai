import { redirect } from 'next/navigation';
import { getUser } from '#src/features/auth/server';

export default async function Home() {
  const user = await getUser().catch((error: unknown) => {
    console.error(error);
    redirect('/login');
  });

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
