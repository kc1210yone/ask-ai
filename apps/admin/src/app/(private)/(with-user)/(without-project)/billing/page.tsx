import 'server-only';
import type { ReactNode } from 'react';
import { BillingPage } from '#src/features/billing';

interface SearchParams {
  success?: string;
  canceled?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props): Promise<ReactNode> => {
  const { success, canceled } = await searchParams;
  return (
    <BillingPage success={success === 'true'} canceled={canceled === 'true'} />
  );
};

export default Page;
