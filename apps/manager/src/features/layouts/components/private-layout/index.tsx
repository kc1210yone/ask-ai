import { AppSidebar } from './app-sidebar';
import type { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from '#src/components/ui/sidebar';
import { getAuthUserOrRedirect } from '#src/features/auth';
import { findUser } from '#src/features/users';

interface Props {
  children: ReactNode;
}

export const PrivateLayout = async ({
  children,
}: Props): Promise<ReactNode> => {
  const authUser = await getAuthUserOrRedirect();
  const user = await findUser(authUser.userId);
  if (!user) {
    // /users/createの時
    return children;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="relative flex-1">
        <SidebarTrigger className="absolute top-0 left-0" />
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
      </div>
    </SidebarProvider>
  );
};
