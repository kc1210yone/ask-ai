'use client';

import 'client-only';
import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useSidebar } from '#src/components/ui/sidebar';

// SPでメニューをクリックして画面遷移した際に、開いたままになっているサイドバーを閉じる
export const CloseMobileSidebarOnNavigate = (): ReactNode => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  return null;
};
