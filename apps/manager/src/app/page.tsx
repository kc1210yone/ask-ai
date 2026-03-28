import Image from 'next/image';
import { cn } from 'tailwind-variants';

const Page = () => {
  return (
    <>
      <h1 className={cn('text-3xl text-red-500')}>Example Page</h1>
      <Image src="/dummy.svg" alt="" width={100} height={20} />
    </>
  );
};

export default Page;
