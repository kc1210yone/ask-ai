import type { ReactNode } from 'react';
import { getAuthUser } from '#src/features/auth';
import { getUser } from '#src/features/users';

export const RootPage = async (): Promise<ReactNode> => {
  const authUser = await getAuthUser();
  const user = await getUser(authUser.userId);
  return <div>{JSON.stringify(user, null, 2)}</div>;
};
