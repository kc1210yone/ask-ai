import { tv } from 'tailwind-variants';
import type { ReactNode } from 'react';

const cardStyles = tv({
  base: 'rounded-2xl border border-gray-200 bg-white shadow-sm',
  variants: {
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-8',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

interface CardProps {
  children: ReactNode;
  className?: string | undefined;
}

export const Card = ({ children, className }: CardProps) => {
  return <div className={cardStyles({ className })}>{children}</div>;
};
